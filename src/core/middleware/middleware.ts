import type { FastifyReply as Response, FastifyRequest as Request } from "fastify";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { RedisTokenStore } from "@/app/modules/auth/infrastructure/services/RedisTokenStore";
import { sessions } from "@/db/schema/schema";

const tokenStore = new RedisTokenStore();

export interface AuthenticatedUserContext {
	idUser: string;
	idSession: string;
	username: string;
}

export const auth = async (req: Request, res: Response) => {
	const accessToken = getBearerToken(req);

	if (accessToken === "") {
		return res.status(401).send({ ok: false, message: "Unauthorized", body: {} });
	}

	const tokenPayload = await tokenStore.get(`access-token:${accessToken}`);

	if (tokenPayload === null) {
		return res.status(401).send({ ok: false, message: "Unauthorized", body: {} });
	}

	try {
		const context = JSON.parse(tokenPayload) as AuthenticatedUserContext;
		const sessionIsActive = await isSessionActive(context.idSession);

		if (!sessionIsActive) {
			return res.status(401).send({ ok: false, message: "Unauthorized", body: {} });
		}

		(req as Request & { user: AuthenticatedUserContext }).user = context;
	} catch {
		return res.status(401).send({ ok: false, message: "Unauthorized", body: {} });
	}
};

export const authExceptAuthModule = async (req: Request, res: Response) => {
	if (
		req.url === "/" ||
		req.url.startsWith("/auth") ||
		req.url.includes("/auth/")
	) {
		return;
	}

	return await auth(req, res);
};

const getBearerToken = (req: Request): string => {
	const authorizationHeader = req.headers.authorization;
	const authorization = Array.isArray(authorizationHeader) ? authorizationHeader[0] : authorizationHeader;
	const [scheme, token] = (authorization ?? "").split(" ");

	if (scheme?.toLowerCase() !== "bearer" || token === undefined) {
		return "";
	}

	return token;
};

const isSessionActive = async (idSession: string): Promise<boolean> => {
	const dbUrl = process.env.POSTGRES_URL;

	if (dbUrl === undefined || dbUrl === "") {
		return false;
	}

	const db = drizzle(dbUrl);
	const [session] = await db.select().from(sessions).where(eq(sessions.id, idSession)).limit(1);

	return session !== undefined && session.revokedAt === null && session.expiresAt > new Date();
};

