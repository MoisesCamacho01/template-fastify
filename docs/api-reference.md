# Referencia de la API

Base local recomendada: `http://localhost:4000/api/v1`.

Todas las respuestas propias del módulo auth usan `{ ok, message, body }`. Los errores de validación generados directamente por Fastify usan su formato estándar y normalmente responden `400`.

## Estado del servicio

### `GET /`

Ruta pública. Confirma que el enrutador v1 está activo.

```json
{ "message": "Login API v1 OK!" }
```

## Registrar un usuario

### `POST /auth/register`

Ruta pública.

```json
{
  "username": "demo",
  "password": "secret123"
}
```

Restricciones declaradas en el esquema HTTP:

- `username`: requerido, cadena, mínimo 3 caracteres; PostgreSQL limita a 100.
- `password`: requerida, cadena, mínimo 6 caracteres.

Respuesta `201`:

```json
{
  "ok": true,
  "message": "User registered successfully",
  "body": {
    "id": "f3ed9138-fc5f-459f-a48d-18c15a8fe242",
    "username": "demo",
    "status": "ACTIVE"
  }
}
```

La contraseña se almacena con BCrypt y factor de coste 10. Un nombre existente devuelve `409` con `message: "User already exists"`. Otros errores internos devuelven `500` sin detalles sensibles.

## Iniciar sesión

### `POST /auth/login`

Ruta pública y mismo cuerpo/restricciones que el registro.

Respuesta `200`:

```json
{
  "ok": true,
  "message": "Login successfully",
  "body": {
    "accessToken": "<96 caracteres hexadecimales>",
    "expiresAt": "2026-07-12T20:00:00.000Z",
    "user": {
      "id": "f3ed9138-fc5f-459f-a48d-18c15a8fe242",
      "username": "demo",
      "status": "ACTIVE"
    }
  }
}
```

El login solo acepta usuarios `ACTIVE`, verifica BCrypt, crea una fila en `sessions`, actualiza `last_login_at` y almacena en Redis:

```text
clave: access-token:<accessToken>
valor: {"idUser":"...","idSession":"...","username":"demo"}
TTL: 86400 segundos
```

Usuario inexistente, inactivo o contraseña incorrecta producen la misma respuesta `401` (`Invalid credentials`) para evitar revelar cuentas.

## Usar el token

Las rutas que se añadan fuera de `/auth` quedan protegidas por el hook global de v1:

```http
Authorization: Bearer <accessToken>
```

El middleware exige que la clave exista en Redis, que su JSON tenga un `idSession` utilizable y que la sesión PostgreSQL exista, no esté revocada y no haya expirado. Cuando es válido adjunta a la petición:

```ts
interface AuthenticatedUserContext {
  idUser: string;
  idSession: string;
  username: string;
}
```

El código de una ruta puede leerlo mediante una intersección tipada o una ampliación de tipos de Fastify. Los fallos responden:

```json
{ "ok": false, "message": "Unauthorized", "body": {} }
```

## Swagger UI y OpenAPI

- Interfaz: `GET /doc`
- JSON generado por el plugin: `GET /doc/json`
- YAML generado por el plugin: `GET /doc/yaml`

Las rutas de auth aparecen bajo la etiqueta `Auth`. La configuración base se encuentra en `swagger/swagger.json`; las respuestas comunes, en `swagger/httpCode.json`.

## CORS

Actualmente acepta cualquier origen (`*`) y anuncia `GET`, `POST`, `PUT`, `PATCH` y `DELETE`. Restringe `origin` en producción.
