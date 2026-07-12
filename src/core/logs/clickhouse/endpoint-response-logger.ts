import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { EndpointResponseLogRepository } from "./EndpointResponseLogRepository";

const requestStarts = new WeakMap<FastifyRequest, bigint>();
const requestErrors = new WeakMap<FastifyRequest, Error>();

export const captureEndpointResponseError = (request: FastifyRequest, error: unknown): void => {
	if (error instanceof Error) {
		requestErrors.set(request, error);
		return;
	}

	requestErrors.set(request, new Error(String(error)));
};

export const registerEndpointResponseLogger = (app: FastifyInstance): void => {
	const repository = new EndpointResponseLogRepository();

	app.addHook("onRequest", async (request) => {
		requestStarts.set(request, process.hrtime.bigint());
	});

	app.addHook("onSend", async (request, reply, payload) => {
		await repository.record(buildLogData(request, reply, normalizePayload(payload), requestErrors.get(request) ?? null));
		return payload;
	});

	app.addHook("onError", async (request, _reply, error) => {
		requestErrors.set(request, error);
	});
};

const buildLogData = (
	request: FastifyRequest,
	reply: FastifyReply,
	responseBody: string,
	error: Error | null,
) => {
	const url = new URL(request.url, "http://localhost");
	const route = request.routeOptions.url ?? request.url;

	return {
		requestId: String(request.id),
		service: "login-api",
		environment: process.env.NOVE_ENV ?? process.env.NODE_ENV ?? "",
		apiVersion: getApiVersion(request.url),
		method: request.method,
		route,
		path: url.pathname,
		queryString: url.search.replace(/^\?/, ""),
		ip: getHeader(request, "x-forwarded-for") ?? request.ip ?? "unknown",
		userAgent: getHeader(request, "user-agent") ?? "unknown",
		idUser: getHeader(request, "x-user-id") ?? "unknown",
		statusCode: reply.statusCode,
		responseTimeMs: getResponseTimeMs(request),
		responseContentType: String(reply.getHeader("content-type") ?? ""),
		responseBody,
		errorName: error?.name ?? "",
		errorMessage: error?.message ?? "",
		createdAt: new Date(),
	};
};

const normalizePayload = (payload: unknown): string => {
	if (payload === undefined || payload === null) {
		return "";
	}

	if (Buffer.isBuffer(payload)) {
		return payload.toString("utf8");
	}

	if (typeof payload === "string") {
		return payload;
	}

	return JSON.stringify(payload);
};

const getResponseTimeMs = (request: FastifyRequest): number => {
	const start = requestStarts.get(request);

	if (start === undefined) {
		return 0;
	}

	return Number((process.hrtime.bigint() - start) / 1_000_000n);
};

const getHeader = (request: FastifyRequest, name: string): string | undefined => {
	const value = request.headers[name];

	if (Array.isArray(value)) {
		return value[0];
	}

	return value;
};

const getApiVersion = (url: string): string => {
	const match = /\/api\/([^/]+)/i.exec(url);

	return match?.[1] ?? "";
};
