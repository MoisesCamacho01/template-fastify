type ClickHouseQueryParams = Record<string, string | number | boolean | Date | null | undefined>;
type ClickHouseJsonValue = string | number | boolean | Date | null;
type ClickHouseJsonRow = Record<string, ClickHouseJsonValue>;

interface ClickHouseConfig {
	host: string;
	port: string;
	database: string;
	username: string;
	password: string;
}

export class ClickHouseDatabase {
	private readonly config: ClickHouseConfig;
	private readonly baseUrl: string;

	public constructor() {
		this.config = {
			host: process.env.CH_HOST ?? "",
			port: process.env.CH_PORT ?? "8123",
			database: process.env.CH_DB_NAME ?? "",
			username: process.env.CH_DB_USER ?? "",
			password: process.env.CH_DB_PASSWORD ?? "",
		};

		this.validateConfig();
		this.baseUrl = this.buildBaseUrl();
	}

	public ping = async (): Promise<boolean> => {
		const response = await fetch(`${this.baseUrl}/ping`, {
			headers: this.authHeaders(),
		});

		return response.ok;
	};

	public query = async <T>(sql: string, params: ClickHouseQueryParams = {}): Promise<T[]> => {
		const response = await this.request(`${sql} FORMAT JSONEachRow`, params);
		const text = await response.text();

		if (text.trim() === "") {
			return [];
		}

		return text
			.trim()
			.split("\n")
			.map((row) => JSON.parse(row) as T);
	};

	public command = async (sql: string, params: ClickHouseQueryParams = {}): Promise<void> => {
		await this.request(sql, params);
	};

	public insertJsonEachRow = async (table: string, rows: ClickHouseJsonRow[]): Promise<void> => {
		if (rows.length === 0) {
			return;
		}

		const payload = rows
			.map((row) => JSON.stringify(this.serializeRow(row)))
			.join("\n");

		await this.request(`INSERT INTO ${table} FORMAT JSONEachRow\n${payload}`, {});
	};

	private readonly request = async (sql: string, params: ClickHouseQueryParams): Promise<Response> => {
		const url = new URL(this.baseUrl);
		url.searchParams.set("database", this.config.database);

		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null) {
				url.searchParams.set(`param_${key}`, value instanceof Date ? value.toISOString() : String(value));
			}
		}

		const response = await fetch(url, {
			method: "POST",
			headers: {
				...this.authHeaders(),
				"content-type": "text/plain; charset=utf-8",
			},
			body: sql,
		});

		if (!response.ok) {
			const message = await response.text();
			throw new Error(`ClickHouse query failed (${response.status}): ${message}`);
		}

		return response;
	};

	private readonly authHeaders = (): Record<string, string> => ({
		Authorization: `Basic ${Buffer.from(`${this.config.username}:${this.config.password}`).toString("base64")}`,
	});

	private readonly buildBaseUrl = (): string => {
		const host = /^https?:\/\//i.test(this.config.host) ? this.config.host : `http://${this.config.host}`;
		const cleanHost = host.replace(/\/+$/, "");
		const hasPort = /:\d+$/.test(cleanHost);

		return hasPort ? cleanHost : `${cleanHost}:${this.config.port}`;
	};

	private readonly validateConfig = (): void => {
		const missingVariables = [
			["CH_HOST", this.config.host],
			["CH_PORT", this.config.port],
			["CH_DB_NAME", this.config.database],
			["CH_DB_USER", this.config.username],
			["CH_DB_PASSWORD", this.config.password],
		]
			.filter(([, value]) => value === "")
			.map(([key]) => key);

		if (missingVariables.length > 0) {
			throw new Error(`Missing ClickHouse environment variables: ${missingVariables.join(", ")}`);
		}
	};

	private readonly serializeRow = (row: ClickHouseJsonRow): Record<string, ClickHouseJsonValue> => {
		return Object.fromEntries(
			Object.entries(row).map(([key, value]) => [
				key,
				value instanceof Date ? this.formatDateTime(value) : value,
			]),
		);
	};

	private readonly formatDateTime = (date: Date): string => {
		return date.toISOString().slice(0, 19).replace("T", " ");
	};
}
