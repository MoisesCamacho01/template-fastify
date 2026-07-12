import net from "node:net";

type RedisValue = string | number | boolean;

interface RedisConfig {
	host: string;
	port: number;
	password: string;
}

export class RedisDatabase {
	private readonly config: RedisConfig;

	public constructor() {
		this.config = {
			host: process.env.REDIS_HOST ?? "",
			port: Number(process.env.REDIS_PORT ?? "6379"),
			password: process.env.REDIS_PASSWORD ?? "",
		};

		this.validateConfig();
	}

	public ping = async (): Promise<boolean> => {
		const response = await this.command("PING");
		return response === "PONG";
	};

	public get = async (key: string): Promise<string | null> => {
		const response = await this.command("GET", key);
		return typeof response === "string" ? response : null;
	};

	public set = async (key: string, value: RedisValue, ttlInSeconds?: number): Promise<boolean> => {
		const args = ttlInSeconds === undefined
			? ["SET", key, String(value)]
			: ["SET", key, String(value), "EX", String(ttlInSeconds)];
		const response = await this.command(...args);

		return response === "OK";
	};

	public del = async (key: string): Promise<number> => {
		const response = await this.command("DEL", key);
		return typeof response === "number" ? response : 0;
	};

	public expire = async (key: string, ttlInSeconds: number): Promise<boolean> => {
		const response = await this.command("EXPIRE", key, String(ttlInSeconds));
		return response === 1;
	};

	public command = async (...args: string[]): Promise<string | number | null> => {
		const socket = await this.connect();

		try {
			if (this.config.password !== "") {
				const authResponse = await this.send(socket, this.encodeCommand(["AUTH", this.config.password]));

				if (authResponse !== "OK") {
					throw new Error("Redis authentication failed");
				}
			}

			return await this.send(socket, this.encodeCommand(args));
		} finally {
			socket.end();
		}
	};

	private readonly connect = async (): Promise<net.Socket> => {
		return await new Promise((resolve, reject) => {
			const socket = net.createConnection({
				host: this.config.host,
				port: this.config.port,
			});

			socket.once("connect", () => resolve(socket));
			socket.once("error", reject);
			socket.setTimeout(5000, () => {
				socket.destroy();
				reject(new Error("Redis connection timeout"));
			});
		});
	};

	private readonly send = async (socket: net.Socket, payload: string): Promise<string | number | null> => {
		return await new Promise((resolve, reject) => {
			const chunks: Buffer[] = [];

			const onData = (chunk: Buffer) => {
				chunks.push(chunk);
				const response = Buffer.concat(chunks).toString("utf8");

				try {
					const parsed = this.parseResponse(response);
					socket.off("data", onData);
					socket.off("error", reject);
					resolve(parsed);
				} catch (error) {
					if (!(error instanceof IncompleteRedisResponseError)) {
						socket.off("data", onData);
						socket.off("error", reject);
						reject(error);
					}
				}
			};

			socket.on("data", onData);
			socket.once("error", reject);
			socket.write(payload);
		});
	};

	private readonly encodeCommand = (args: string[]): string => {
		const parts = args.flatMap((arg) => [`$${Buffer.byteLength(arg)}`, arg]);
		return [`*${args.length}`, ...parts].join("\r\n") + "\r\n";
	};

	private readonly parseResponse = (response: string): string | number | null => {
		const type = response[0];

		if (type === "+") {
			return this.readLine(response, 1);
		}

		if (type === ":") {
			return Number(this.readLine(response, 1));
		}

		if (type === "$") {
			const length = Number(this.readLine(response, 1));

			if (length === -1) {
				return null;
			}

			const bodyStart = response.indexOf("\r\n") + 2;
			const bodyEnd = bodyStart + length;

			if (response.length < bodyEnd + 2) {
				throw new IncompleteRedisResponseError();
			}

			return response.slice(bodyStart, bodyEnd);
		}

		if (type === "-") {
			throw new Error(`Redis error: ${this.readLine(response, 1)}`);
		}

		throw new IncompleteRedisResponseError();
	};

	private readonly readLine = (response: string, start: number): string => {
		const end = response.indexOf("\r\n", start);

		if (end === -1) {
			throw new IncompleteRedisResponseError();
		}

		return response.slice(start, end);
	};

	private readonly validateConfig = (): void => {
		const missingVariables = [
			["REDIS_HOST", this.config.host],
			["REDIS_PORT", Number.isFinite(this.config.port) ? String(this.config.port) : ""],
		]
			.filter(([, value]) => value === "")
			.map(([key]) => key);

		if (missingVariables.length > 0) {
			throw new Error(`Missing Redis environment variables: ${missingVariables.join(", ")}`);
		}
	};
}

class IncompleteRedisResponseError extends Error {}
