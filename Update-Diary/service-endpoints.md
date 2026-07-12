# Login API - Mapa de endpoints

Base URL local por defecto: `http://localhost:4000/api/v1`

## Salud del servicio

| Metodo | Ruta | Uso |
| --- | --- | --- |
| `GET` | `/` | Verifica que la API v1 este respondiendo. |

## Auth

| Metodo | Ruta |
| --- | --- |
| `POST` | `/auth/register` |
| `POST` | `/auth/register-company` |
| `POST` | `/auth/login` |
| `POST` | `/auth/logout` |
| `POST` | `/auth/refresh-token` |
| `POST` | `/auth/forgot-password` |
| `POST` | `/auth/reset-password` |
| `POST` | `/auth/verify-email` |
| `POST` | `/auth/resend-verify-email` |
| `POST` | `/auth/select-tenant` |

Payloads mas importantes:

- `register`: `email`, `password`, `profile?`, `tenant: null`
- `register-company`: `email`, `password`, `profile?`, `tenant`
- `login`: `email`, `password`
- `logout`: `refreshToken`
- `refresh-token`: `refreshToken`
- `reset-password`: `token`, `password`
- `verify-email`: `token`
- `select-tenant`: `idTenant`

## MFA

| Metodo | Ruta |
| --- | --- |
| `POST` | `/mfa/setup` |
| `POST` | `/mfa/verify` |
| `POST` | `/mfa/disable` |

Payloads clave:

- `setup`: `type?`, `issuer?`
- `verify`: `code`, `type?`, `temporaryToken?`
- `disable`: `code`, `type?`

## Tenants

| Metodo | Ruta |
| --- | --- |
| `POST` | `/tenants` |
| `GET` | `/tenants` |
| `GET` | `/tenants/:tenantId` |
| `PUT` | `/tenants/:tenantId` |
| `POST` | `/tenants/:tenantId/users` |
| `GET` | `/tenants/:tenantId/users` |
| `DELETE` | `/tenants/:tenantId/users/:userId` |

## Roles y permisos

| Metodo | Ruta |
| --- | --- |
| `POST` | `/tenants/:tenantId/roles` |
| `GET` | `/tenants/:tenantId/roles` |
| `PUT` | `/tenants/:tenantId/roles/:roleId` |
| `DELETE` | `/tenants/:tenantId/roles/:roleId` |
| `GET` | `/permissions` |
| `POST` | `/roles/:roleId/permissions` |
| `DELETE` | `/roles/:roleId/permissions/:permissionId` |
| `POST` | `/tenants/:tenantId/users/:userId/roles` |
| `DELETE` | `/tenants/:tenantId/users/:userId/roles/:roleId` |

## Perfil y sesiones del usuario autenticado

| Metodo | Ruta |
| --- | --- |
| `GET` | `/me` |
| `PUT` | `/me/profile` |
| `PUT` | `/me/password` |
| `GET` | `/me/sessions` |
| `DELETE` | `/me/sessions/:id` |

## Usuarios

| Metodo | Ruta |
| --- | --- |
| `GET` | `/users` |
| `POST` | `/users/create` |
| `PUT` | `/users/put/:id` |
| `PATCH` | `/users/patch/:id` |
| `DELETE` | `/users/delete/:id` |

## OIDC y OAuth

| Metodo | Ruta |
| --- | --- |
| `GET` | `/.well-known/openid-configuration` |
| `GET` | `/oauth/jwks` |
| `GET` | `/oauth/userinfo` |
| `POST` | `/oauth/revoke` |
| `POST` | `/oauth/clients` |
| `GET` | `/oauth/clients` |
| `PUT` | `/oauth/clients/:clientId` |
| `DELETE` | `/oauth/clients/:clientId` |
| `GET` | `/auth/logs` |
| `GET` | `/tenants/:tenantId/auth/logs` |

## Rutas protegidas

Salvo las excepciones definidas por middleware, las rutas requieren:

```http
Authorization: Bearer <access-token>
```

Excepciones publicas actuales:

- `/`
- `/auth/*`
- `/mfa/verify`
- `/.well-known/openid-configuration`
- `/oauth/jwks`

## Referencia practica

- Swagger UI: `http://localhost:4000/doc`
- API base: `http://localhost:4000/api/v1`
