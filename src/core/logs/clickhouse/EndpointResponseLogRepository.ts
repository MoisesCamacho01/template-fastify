import crypto from "node:crypto";
import { ClickHouseDatabase } from "@/core/database/clickhouse/clickhouse";

export interface EndpointResponseLogData {
	requestId: string;
	service: string;
	environment: string;
	apiVersion: string;
	method: string;
	route: string;
	path: string;
	queryString: string;
	ip: string;
	userAgent: string;
	idUser: string;
	statusCode: number;
	responseTimeMs: number;
	responseContentType: string;
	responseBody: string;
	errorName: string;
	errorMessage: string;
	createdAt: Date;
}

export class EndpointResponseLogRepository {
	private readonly database: ClickHouseDatabase;

	public constructor() {
		this.database = new ClickHouseDatabase();
	}

	public record = async (data: EndpointResponseLogData): Promise<void> => {
		try {
			await this.database.insertJsonEachRow("endpoint_response_logs", [
				{
					id: crypto.randomUUID(),
					request_id: this.toUuid(data.requestId),
					service: data.service,
					environment: data.environment,
					api_version: data.apiVersion,
					method: data.method,
					route: data.route,
					path: data.path,
					query_string: data.queryString,
					ip: data.ip,
					user_agent: data.userAgent,
					id_user: data.idUser,
					status_code: data.statusCode,
					response_time_ms: data.responseTimeMs,
					response_content_type: data.responseContentType,
					response_body: data.responseBody,
					response_body_size: Buffer.byteLength(data.responseBody),
					response_hash: this.hash(data.responseBody),
					error_name: data.errorName,
					error_message: data.errorMessage,
					created_at: data.createdAt,
				},
			]);
		} catch (error) {
			console.error("[clickhouse-endpoint-response-log]", error);
		}
	};

	private readonly hash = (value: string): string => {
		return crypto.createHash("sha256").update(value).digest("hex");
	};

	private readonly toUuid = (value: string): string => {
		const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		return uuidRegex.test(value) ? value : crypto.randomUUID();
	};
}
