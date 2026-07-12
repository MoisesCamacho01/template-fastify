# Login API - Vision general del servicio

## Proposito

`login-api` es un servicio de autenticacion e identidad construido con Fastify y TypeScript. Su responsabilidad principal es centralizar el ciclo de acceso de usuarios, sesiones, tenants, roles, MFA y capacidades OIDC para otros sistemas.

La API publica su version principal bajo `/api/v1` y expone Swagger UI en `/doc`.

## Capacidades principales

- Registro de usuario individual.
- Registro de compania con tenant inicial.
- Login con emision de `accessToken`, `refreshToken` e `idToken`.
- Seleccion de tenant activo para sesiones multi-tenant.
- Logout y refresh de tokens.
- Recuperacion y verificacion de email.
- MFA con flujo TOTP.
- Gestion de tenants y usuarios por tenant.
- Gestion de roles y permisos.
- Perfil del usuario autenticado y administracion de sesiones activas.
- Endpoints OIDC y administracion de clientes OAuth.
- Logging de respuestas y accesos hacia ClickHouse.

## Arquitectura

El proyecto sigue una organizacion por modulos en `src/app/modules`, con separacion en:

- `application`: DTOs y casos de uso.
- `domain`: contratos y reglas del dominio.
- `infrastructure`: controladores, rutas, repositorios, servicios y swagger.

Adicionalmente:

- `src/db/schema/schema.ts` define el esquema relacional con Drizzle.
- `src/core/middleware/middleware.ts` resuelve autenticacion por bearer token y sesion activa.
- `src/core/logs/clickhouse` registra metadata de respuesta por endpoint.

## Modulos actuales

| Modulo | Responsabilidad |
| --- | --- |
| `auth` | Registro, login, logout, refresh, verificacion de email, reset de password y seleccion de tenant. |
| `auth/mfa` | Configuracion, verificacion y desactivacion de MFA. |
| `empresa_tenants` | CRUD operativo del tenant autenticado y su membresia. |
| `roles_permisos` | Roles por tenant, asignacion de permisos y roles a usuarios. |
| `user_profile` | Perfil del usuario autenticado, password y sesiones. |
| `users` | CRUD administrativo de usuarios. |
| `oidc` | Discovery OIDC, JWKS, userinfo, revocacion, clientes OAuth y logs. |

## Persistencia y dependencias

Segun el codigo y `.env-example`, el servicio se apoya en:

- PostgreSQL: usuarios, tenants, sesiones, tokens, clientes OAuth, MFA y relaciones.
- Redis: almacenamiento de tokens y estado de autenticacion.
- ClickHouse: logs de acceso y logs de respuesta.
- Docker Compose: contenedor de desarrollo del servicio.

## Seguridad actual

- La mayoria de rutas quedan protegidas por `authExceptAuthModule`.
- El middleware espera `Authorization: Bearer <token>`.
- Ademas del token en Redis, la sesion asociada debe seguir activa en PostgreSQL.
- Los endpoints publicos incluyen:
  - `/api/v1/`
  - `/api/v1/auth/*`
  - `/api/v1/mfa/verify`
  - `/api/v1/.well-known/openid-configuration`
  - `/api/v1/oauth/jwks`

## Variables importantes

Estas variables aparecen en `.env-example` y son las mas relevantes para correr el servicio:

- `PORT`
- `POSTGRES_URL`
- `DATABASE_URL`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `CH_HOST`, `CH_PORT`, `CH_DB_NAME`, `CH_DB_USER`, `CH_DB_PASSWORD`
- `SECRET_JWT`
- `OIDC_KEY_ID`, `OIDC_PRIVATE_KEY`, `OIDC_PUBLIC_KEY`

## Flujo base recomendado

1. Registrar usuario o compania.
2. Verificar email si el flujo de negocio lo exige.
3. Hacer login.
4. Si el usuario tiene MFA, completar verificacion MFA.
5. Consumir rutas protegidas con el `accessToken`.
6. Refrescar o revocar sesion cuando corresponda.
