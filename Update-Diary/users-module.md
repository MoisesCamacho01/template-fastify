# Modulo Users

Este modulo administra los usuarios de la API. Vive en `src/app/modules/users` y esta conectado a la ruta base `/api/v1/users`.

## Estructura interna

- `application/dtos`: contratos de entrada y salida del modulo.
- `application/use_case`: casos de uso para listar, crear, reemplazar, actualizar parcialmente y eliminar usuarios.
- `domain`: entidad `User`, estados validos, contrato del repositorio y errores del dominio.
- `infrastructure/controllers`: controlador HTTP de Fastify.
- `infrastructure/repositories/drizzle`: implementacion del repositorio con Drizzle ORM.
- `infrastructure/schemas`: tabla `users`.
- `infrastructure/services`: servicio para hashear passwords con bcrypt.
- `infrastructure/swagger`: definicion Swagger del modulo.

## Campos principales

| Campo | Tipo | Uso |
| --- | --- | --- |
| `id` | `uuid` | Identificador generado por la base de datos. |
| `email` | `string` | Correo unico del usuario. |
| `password` | `string` | Password recibido por API; se guarda hasheado. |
| `status` | `string` | Estado del usuario. Si no se envia al crear, usa `pending_verification`. |
| `createdAt` | `Date` | Fecha de creacion. |
| `updatedAt` | `Date` | Fecha de actualizacion. |

Estados aceptados:

- `active`
- `inactive`
- `suspended`
- `pending_verification`
- `deleted`

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/api/v1/users` | Lista usuarios. Requiere header `apikey: 123456`. |
| `POST` | `/api/v1/users/create` | Crea un usuario. |
| `PUT` | `/api/v1/users/put/:id` | Reemplaza todos los campos editables del usuario. |
| `PATCH` | `/api/v1/users/patch/:id` | Actualiza uno o mas campos del usuario. |
| `DELETE` | `/api/v1/users/delete/:id` | Elimina un usuario por id. |

## Como usarlo

Crear usuario:

```bash
curl -X POST http://localhost:3000/api/v1/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "status": "active"
  }'
```

Listar usuarios:

```bash
curl http://localhost:3000/api/v1/users \
  -H "apikey: 123456"
```

Actualizar parcialmente:

```bash
curl -X PATCH http://localhost:3000/api/v1/users/patch/USER_UUID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

## Respuestas y errores

Las respuestas exitosas usan esta forma:

```json
{
  "ok": true,
  "message": "User created successfully",
  "body": {}
}
```

Errores controlados:

- `409`: el email ya existe.
- `404`: usuario no encontrado.
- `422`: datos invalidos, por ejemplo un `PATCH` sin campos.
- `500`: error inesperado.

## Notas de implementacion

- `CreateUser`, `PutUser` y `PatchUser` hashean el password antes de persistirlo.
- `CreateUser` evita emails duplicados antes de crear.
- `PutUser` exige `email`, `password` y `status`.
- `PatchUser` permite campos opcionales, pero no acepta un body vacio.
