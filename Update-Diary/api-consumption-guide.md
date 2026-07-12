# Guia para consumir las APIs

## Base de la API

En ambiente local, la API expone su version principal en:

```text
http://localhost:4000/api/v1
```

La documentacion interactiva de Swagger esta en:

```text
http://localhost:4000/doc
```

## Formato general

La API trabaja con JSON. En la mayoria de solicitudes debes enviar:

```http
Content-Type: application/json
```

La mayor parte de rutas protegidas requieren:

```http
Authorization: Bearer <access-token>
```

## Flujo recomendado de consumo

1. Registrar usuario o compania.
2. Hacer login.
3. Guardar `accessToken`, `refreshToken` e `idToken`.
4. Consumir rutas protegidas con `Authorization: Bearer <access-token>`.
5. Si el token expira, usar `refresh-token`.
6. Cerrar sesion con `logout` cuando corresponda.

## 1. Verificar que la API este activa

```bash
curl http://localhost:4000/api/v1/
```

Respuesta esperada:

```json
{
  "message": "Login API v1 OK!"
}
```

## 2. Registrar usuario

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123*",
    "profile": {
      "name": "Juan",
      "lastName": "Perez",
      "phone": "0999999999"
    },
    "tenant": null
  }'
```

## 3. Registrar compania con tenant inicial

```bash
curl -X POST http://localhost:4000/api/v1/auth/register-company \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "Password123*",
    "profile": {
      "name": "Ana",
      "lastName": "Lopez"
    },
    "tenant": {
      "name": "Mi Empresa",
      "slug": "mi-empresa",
      "website": "https://miempresa.com"
    }
  }'
```

## 4. Hacer login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123*"
  }'
```

Respuesta tipica:

```json
{
  "ok": true,
  "message": "Login successfully",
  "body": {
    "accessToken": "ACCESS_TOKEN",
    "refreshToken": "REFRESH_TOKEN",
    "idToken": "ID_TOKEN",
    "expiresAt": "2026-05-12T12:00:00.000Z",
    "user": {
      "id": "USER_UUID",
      "email": "user@example.com",
      "status": "ACTIVE",
      "emailVerified": true
    }
  }
}
```

Guarda al menos:

- `body.accessToken`
- `body.refreshToken`
- `body.idToken`

## 5. Consumir una ruta protegida

Ejemplo para consultar el perfil autenticado:

```bash
curl http://localhost:4000/api/v1/me \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

Ejemplo para listar usuarios:

```bash
curl http://localhost:4000/api/v1/users \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## 6. Refrescar token

Cuando el `accessToken` expire, usa el `refreshToken`:

```bash
curl -X POST http://localhost:4000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "REFRESH_TOKEN"
  }'
```

## 7. Cerrar sesion

```bash
curl -X POST http://localhost:4000/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "REFRESH_TOKEN"
  }'
```

## Consumo de endpoints principales

### Auth

- `POST /auth/register`
- `POST /auth/register-company`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh-token`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`
- `POST /auth/resend-verify-email`
- `POST /auth/select-tenant`

### MFA

- `POST /mfa/setup`
- `POST /mfa/verify`
- `POST /mfa/disable`

### Perfil autenticado

- `GET /me`
- `PUT /me/profile`
- `PUT /me/password`
- `GET /me/sessions`
- `DELETE /me/sessions/:id`

### Tenants

- `POST /tenants`
- `GET /tenants`
- `GET /tenants/:tenantId`
- `PUT /tenants/:tenantId`
- `POST /tenants/:tenantId/users`
- `GET /tenants/:tenantId/users`
- `DELETE /tenants/:tenantId/users/:userId`

### Roles y permisos

- `POST /tenants/:tenantId/roles`
- `GET /tenants/:tenantId/roles`
- `PUT /tenants/:tenantId/roles/:roleId`
- `DELETE /tenants/:tenantId/roles/:roleId`
- `GET /permissions`
- `POST /roles/:roleId/permissions`
- `DELETE /roles/:roleId/permissions/:permissionId`
- `POST /tenants/:tenantId/users/:userId/roles`
- `DELETE /tenants/:tenantId/users/:userId/roles/:roleId`

### OIDC y OAuth

- `GET /.well-known/openid-configuration`
- `GET /oauth/jwks`
- `GET /oauth/userinfo`
- `POST /oauth/revoke`
- `POST /oauth/clients`
- `GET /oauth/clients`
- `PUT /oauth/clients/:clientId`
- `DELETE /oauth/clients/:clientId`
- `GET /auth/logs`
- `GET /tenants/:tenantId/auth/logs`

## Ejemplo de actualizacion de perfil

```bash
curl -X PUT http://localhost:4000/api/v1/me/profile \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "lastName": "Perez",
    "phone": "0988888888",
    "biography": "Perfil actualizado desde API"
  }'
```

## Ejemplo de seleccion de tenant

Si el usuario trabaja con varios tenants:

```bash
curl -X POST http://localhost:4000/api/v1/auth/select-tenant \
  -H "Content-Type: application/json" \
  -d '{
    "idTenant": "TENANT_UUID"
  }'
```

## Errores comunes al consumir la API

- `401 Unauthorized`: token ausente, token invalido o sesion revocada.
- `400 Bad Request`: payload incompleto o con formato incorrecto.
- `404 Not Found`: recurso no encontrado.
- `409 Conflict`: colision de datos, por ejemplo email o slug ya existente.
- `422 Unprocessable Entity`: validacion de negocio.
- `500 Internal Server Error`: error interno del servicio.

## Recomendaciones practicas

- Usa Swagger para revisar schemas y probar endpoints rapidamente.
- Guarda `accessToken` y `refreshToken` de forma segura.
- No reutilices payloads de ejemplo sin ajustar correos, ids y slugs.
- Para rutas protegidas, verifica primero que el login te devolvio tokens validos.
- Si una operacion depende de un tenant o un usuario, valida antes los UUID que vas a enviar.
