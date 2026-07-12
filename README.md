# Login API

Servicio de autenticacion e identidad construido con Fastify, TypeScript y Drizzle ORM. Este proyecto centraliza registro, login, sesiones, MFA, tenants, roles, permisos, perfiles de usuario y capacidades OIDC/OAuth para otros sistemas.

## Que hace este servicio

- Registra usuarios y companias.
- Administra login, logout, refresh token y reset de password.
- Soporta verificacion de email y seleccion de tenant activo.
- Maneja MFA basado en TOTP.
- Expone endpoints para tenants, roles, permisos y perfil del usuario autenticado.
- Publica endpoints OIDC como discovery, JWKS y userinfo.
- Guarda logs de acceso y respuestas para auditoria.

## Stack principal

- Fastify
- TypeScript
- Drizzle ORM
- PostgreSQL
- Redis
- ClickHouse
- Swagger UI
- Docker Compose

## Rutas principales

- Base API: `http://localhost:4000/api/v1`
- Swagger UI: `http://localhost:4000/doc`

## Modulos actuales

| Modulo | Descripcion |
| --- | --- |
| `auth` | Registro, login, refresh token, logout, verificacion de email y recuperacion de password. |
| `mfa` | Configuracion, verificacion y desactivacion de MFA. |
| `empresa_tenants` | Administracion de tenants y miembros del tenant. |
| `roles_permisos` | Roles por tenant, permisos y asignacion de roles a usuarios. |
| `user_profile` | Perfil del usuario autenticado, cambio de password y sesiones. |
| `users` | CRUD administrativo de usuarios. |
| `oidc` | Discovery OIDC, JWKS, userinfo, clientes OAuth y logs de autenticacion. |

## Autenticacion

La mayor parte de la API requiere:

```http
Authorization: Bearer <access-token>
```

Las rutas publicas actuales son:

- `/api/v1/`
- `/api/v1/auth/*`
- `/api/v1/mfa/verify`
- `/api/v1/.well-known/openid-configuration`
- `/api/v1/oauth/jwks`

El middleware valida el token contra Redis y confirma que la sesion siga activa en PostgreSQL.

## Variables de entorno

Revisa [`.env-example`](/C:/Proyectos/APIs/OBIUX/loginApi/.env-example). Las variables mas importantes para levantar el servicio son:

- `PORT`
- `POSTGRES_URL`
- `DATABASE_URL`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `CH_HOST`, `CH_PORT`, `CH_DB_NAME`, `CH_DB_USER`, `CH_DB_PASSWORD`
- `SECRET_JWT`
- `APP_NAME`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`
- `OAUTH_GOOGLE_CLIENT_ID`, `OAUTH_GOOGLE_CLIENT_SECRET`
- `OAUTH_MICROSOFT_CLIENT_ID`, `OAUTH_MICROSOFT_CLIENT_SECRET`
- `OAUTH_FACEBOOK_CLIENT_ID`, `OAUTH_FACEBOOK_CLIENT_SECRET`
- `OAUTH_<PROVIDER>_CLIENT_ID`, `OAUTH_<PROVIDER>_CLIENT_SECRET`, `OAUTH_<PROVIDER>_AUTHORIZATION_URL`, `OAUTH_<PROVIDER>_TOKEN_URL`, `OAUTH_<PROVIDER>_USERINFO_URL`
- `OIDC_KEY_ID`, `OIDC_PRIVATE_KEY`, `OIDC_PUBLIC_KEY`

Si `SMTP_HOST` no esta configurado, el servicio usa el email sender falso y solo registra los correos en consola. Con SMTP configurado, envia correos de cuenta creada, solicitud de verificacion, verificacion exitosa, recuperacion de password y password actualizado.

OAuth externo funciona con rutas genericas como `/api/v1/auth/google`, `/api/v1/auth/google/callback`, `/api/v1/auth/microsoft` y cualquier proveedor configurado con el prefijo `OAUTH_<PROVIDER>_*`.

## Ejecucion

En desarrollo:

```bash
npm run dev
```

Con Docker Compose:

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Documentacion adicional

Documentacion nueva del servicio:

- [Vision general del servicio](Update-Diary/service-overview.md)
- [Mapa de endpoints](Update-Diary/service-endpoints.md)

Documentacion previa por modulo y bitacora:

- [Auth module](Update-Diary/auth-module.md)
- [Users module](Update-Diary/users-module.md)
- [Addresses module](Update-Diary/addresses-module.md)
- [Profiles module](Update-Diary/profiles-module.md)
- [Preferences module](Update-Diary/preferences-module.md)
- [Entity Swagger](Update-Diary/entity-swagger.md)
