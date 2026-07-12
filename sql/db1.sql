CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "public"."identity_providers" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "code" varchar NOT NULL UNIQUE,
    "name" varchar NOT NULL,
    "status" general_status NOT NULL DEFAULT 'ACTIVE',
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."mfa_challenges" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_user" uuid NOT NULL,
    "id_session" uuid,
    "type" mfa_type NOT NULL,
    "code_hash" varchar,
    "attempts" smallint NOT NULL DEFAULT 0,
    "expires_at" timestamp NOT NULL,
    "verified_at" timestamp,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."mfa_methods" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_user" uuid NOT NULL,
    "type" mfa_type NOT NULL,
    "secret_hash" varchar,
    "destination" varchar,
    "enabled" boolean NOT NULL DEFAULT FALSE,
    "verified" boolean NOT NULL DEFAULT FALSE,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."oauth_clients" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "client_id" varchar NOT NULL UNIQUE,
    "client_secret_hash" varchar,
    "name" varchar NOT NULL,
    "type" client_type NOT NULL DEFAULT 'PUBLIC',
    "redirect_uris" jsonb NOT NULL DEFAULT '[]',
    "allowed_scopes" jsonb NOT NULL DEFAULT '[]',
    "allowed_grant_types" jsonb NOT NULL DEFAULT '[]',
    "status" general_status NOT NULL DEFAULT 'ACTIVE',
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "oauth_clients_idx_oauth_clients_client_id" ON "public"."oauth_clients" ("client_id");

CREATE TABLE "public"."permissions" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "code" varchar(150) NOT NULL UNIQUE,
    "name" varchar(100) NOT NULL,
    "description" text,
    "module" varchar(100),
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "permissions_idx_permissions_module" ON "public"."permissions" ("module");

CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_user" uuid NOT NULL UNIQUE,
    "name" varchar(100),
    "last_name" varchar(100),
    "phone" varchar(30),
    "ext_phone" varchar(20),
    "gender" varchar(30),
    "birthdate" date,
    "profile_photo" varchar(255),
    "biography" text,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "profiles_idx_profiles_user" ON "public"."profiles" ("id_user");

CREATE TABLE "public"."refresh_tokens" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_user" uuid NOT NULL,
    "id_session" uuid NOT NULL,
    "token_hash" varchar(255) NOT NULL UNIQUE,
    "revoked" boolean NOT NULL DEFAULT FALSE,
    "revoked_at" timestamp,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "refresh_tokens_idx_refresh_tokens_user" ON "public"."refresh_tokens" ("id_user");

CREATE TABLE "public"."role_permissions" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_role" uuid NOT NULL,
    "id_permission" uuid NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."roles" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_tenant" uuid,
    "code" varchar NOT NULL,
    "name" varchar NOT NULL,
    "description" text,
    "is_system" boolean NOT NULL DEFAULT FALSE,
    "status" general_status NOT NULL DEFAULT 'ACTIVE',
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "roles_idx_roles_tenant" ON "public"."roles" ("id_tenant");
CREATE UNIQUE INDEX "roles_uq_roles_code_per_tenant" ON "public"."roles" ("code");

CREATE TABLE "public"."sessions" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_user" uuid NOT NULL,
    "id_tenant" uuid,
    "session_code" varchar(150) NOT NULL UNIQUE,
    "platform" varchar(50),
    "device_id" varchar(150),
    "device_name" varchar(150),
    "ip" varchar(45),
    "user_agent" text,
    "is_current" boolean NOT NULL DEFAULT TRUE,
    "revoked" boolean NOT NULL DEFAULT FALSE,
    "revoked_at" timestamp,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "sessions_idx_sessions_tenant" ON "public"."sessions" ("id_tenant");
CREATE INDEX "sessions_idx_sessions_user" ON "public"."sessions" ("id_user");

CREATE TABLE "public"."tenant_user_roles" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_tenant" uuid NOT NULL,
    "id_user" uuid NOT NULL,
    "id_role" uuid NOT NULL,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "tenant_user_roles_idx_tenant_user_roles_tenant" ON "public"."tenant_user_roles" ("id_tenant");
CREATE INDEX "tenant_user_roles_idx_tenant_user_roles_user" ON "public"."tenant_user_roles" ("id_user");

CREATE TABLE "public"."tenant_users" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_tenant" uuid NOT NULL,
    "id_user" uuid NOT NULL,
    "status" tenant_user_status NOT NULL DEFAULT 'ACTIVE',
    "joined_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "tenant_users_idx_tenant_users_tenant" ON "public"."tenant_users" ("id_tenant");
CREATE INDEX "tenant_users_idx_tenant_users_user" ON "public"."tenant_users" ("id_user");

CREATE TABLE "public"."tenants" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "name" varchar NOT NULL,
    "slug" varchar NOT NULL UNIQUE,
    "logo" varchar,
    "website" varchar,
    "status" general_status NOT NULL DEFAULT 'ACTIVE',
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."user_identities" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "id_user" uuid NOT NULL,
    "id_provider" uuid NOT NULL,
    "provider_user_id" varchar(255) NOT NULL,
    "email" varchar(150),
    "access_token_hash" varchar(255),
    "refresh_token_hash" varchar(255),
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."users" (
    "id" uuid NOT NULL DEFAULT 'uuid_generate_v4()',
    "email" varchar NOT NULL UNIQUE,
    "password_hash" varchar NOT NULL,
    "status" user_status NOT NULL DEFAULT 'PENDING_VERIFY',
    "email_verified" boolean NOT NULL DEFAULT FALSE,
    "last_login_at" timestamp,
    "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
-- Indexes
CREATE INDEX "users_idx_users_email" ON "public"."users" ("email");

-- Foreign key constraints
-- Schema: public
ALTER TABLE "public"."profiles" ADD CONSTRAINT "fk_profiles_id_user_users_id" FOREIGN KEY("id_user") REFERENCES "public"."users"("id");
ALTER TABLE "public"."tenant_users" ADD CONSTRAINT "fk_tenant_users_id_tenant_tenants_id" FOREIGN KEY("id_tenant") REFERENCES "public"."tenants"("id");
ALTER TABLE "public"."tenant_users" ADD CONSTRAINT "fk_tenant_users_id_user_users_id" FOREIGN KEY("id_user") REFERENCES "public"."users"("id");
ALTER TABLE "public"."roles" ADD CONSTRAINT "fk_roles_id_tenant_tenants_id" FOREIGN KEY("id_tenant") REFERENCES "public"."tenants"("id");
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "fk_role_permissions_id_role_roles_id" FOREIGN KEY("id_role") REFERENCES "public"."roles"("id");
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "fk_role_permissions_id_permission_permissions_id" FOREIGN KEY("id_permission") REFERENCES "public"."permissions"("id");
ALTER TABLE "public"."tenant_user_roles" ADD CONSTRAINT "fk_tenant_user_roles_id_tenant_tenants_id" FOREIGN KEY("id_tenant") REFERENCES "public"."tenants"("id");
ALTER TABLE "public"."tenant_user_roles" ADD CONSTRAINT "fk_tenant_user_roles_id_user_users_id" FOREIGN KEY("id_user") REFERENCES "public"."users"("id");
ALTER TABLE "public"."tenant_user_roles" ADD CONSTRAINT "fk_tenant_user_roles_id_role_roles_id" FOREIGN KEY("id_role") REFERENCES "public"."roles"("id");
ALTER TABLE "public"."sessions" ADD CONSTRAINT "fk_sessions_id_user_users_id" FOREIGN KEY("id_user") REFERENCES "public"."users"("id");
ALTER TABLE "public"."sessions" ADD CONSTRAINT "fk_sessions_id_tenant_tenants_id" FOREIGN KEY("id_tenant") REFERENCES "public"."tenants"("id");
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "fk_refresh_tokens_id_user_users_id" FOREIGN KEY("id_user") REFERENCES "public"."users"("id");
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "fk_refresh_tokens_id_session_sessions_id" FOREIGN KEY("id_session") REFERENCES "public"."sessions"("id");
ALTER TABLE "public"."user_identities" ADD CONSTRAINT "fk_user_identities_id_user_users_id" FOREIGN KEY("id_user") REFERENCES "public"."users"("id");
ALTER TABLE "public"."user_identities" ADD CONSTRAINT "fk_user_identities_id_provider_identity_providers_id" FOREIGN KEY("id_provider") REFERENCES "public"."identity_providers"("id");
ALTER TABLE "public"."mfa_methods" ADD CONSTRAINT "fk_mfa_methods_id_user_users_id" FOREIGN KEY("id_user") REFERENCES "public"."users"("id");
ALTER TABLE "public"."mfa_challenges" ADD CONSTRAINT "fk_mfa_challenges_id_user_users_id" FOREIGN KEY("id_user") REFERENCES "public"."users"("id");
ALTER TABLE "public"."mfa_challenges" ADD CONSTRAINT "fk_mfa_challenges_id_session_sessions_id" FOREIGN KEY("id_session") REFERENCES "public"."sessions"("id");
