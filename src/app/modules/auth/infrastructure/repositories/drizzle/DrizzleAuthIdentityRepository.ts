import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { DataBase } from "@/app/modules/auth/infrastructure/database/database";
import { sessions, users } from "@/db/schema/schema";
import type {
	AuthIdentityRepository,
	AuthSessionIdentity,
	AuthUserIdentity,
} from "@/app/modules/auth/domain/auth-identity.repository";
import type { LoginMetadataDto, RegisterUserDto } from "@/app/modules/auth/application/dtos/auth.dtos";

export class DrizzleAuthIdentityRepository implements AuthIdentityRepository {
	private readonly database: DataBase;

	public constructor() {
		this.database = new DataBase();
	}

	public findUserByUsername = async (username: string): Promise<AuthUserIdentity | null> => {
		const db = await this.database.connect();
		const [row] = await db.select().from(users).where(eq(users.username, username)).limit(1);

		return row === undefined ? null : this.toUser(row);
	};

	public registerUser = async (data: RegisterUserDto, passwordHash: string): Promise<AuthUserIdentity> => {
		const db = await this.database.connect();
		const [user] = await db
			.insert(users)
			.values({
				username: data.username,
				passwordHash,
				status: "ACTIVE",
			})
			.returning();

		if (user === undefined) {
			throw new Error("User could not be created");
		}

		return this.toUser(user);
	};

	public createSession = async (
		user: AuthUserIdentity,
		metadata: LoginMetadataDto,
	): Promise<AuthSessionIdentity> => {
		const db = await this.database.connect();
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const [session] = await db
			.insert(sessions)
			.values({
				idUser: user.id,
				sessionCode: crypto.randomUUID(),
				ip: metadata.ip,
				userAgent: metadata.userAgent,
				expiresAt,
			})
			.returning();

		if (session === undefined) {
			throw new Error("Session could not be created");
		}

		await db.update(users).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(users.id, user.id));

		return {
			id: session.id,
			idUser: session.idUser,
			sessionCode: session.sessionCode,
			expiresAt: session.expiresAt,
		};
	};

	private readonly toUser = (user: typeof users.$inferSelect): AuthUserIdentity => ({
		id: user.id,
		username: user.username,
		passwordHash: user.passwordHash,
		status: user.status,
	});
}
