import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userStatus = pgEnum("user_status", ["ACTIVE", "INACTIVE"]);

export const users = pgTable("users", {
	id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
	username: varchar("username", { length: 100 }).unique().notNull(),
	passwordHash: varchar("password_hash").notNull(),
	status: userStatus("status").default("ACTIVE").notNull(),
	lastLoginAt: timestamp("last_login_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
	id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
	idUser: uuid("id_user").notNull().references(() => users.id),
	sessionCode: varchar("session_code", { length: 150 }).unique().notNull(),
	ip: varchar("ip", { length: 45 }),
	userAgent: text("user_agent"),
	revokedAt: timestamp("revoked_at"),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
