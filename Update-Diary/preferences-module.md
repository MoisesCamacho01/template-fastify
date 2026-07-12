# Modulo Preferences

Este modulo administra preferencias de usuario. Vive en `src/app/modules/preferences` y esta conectado a la ruta base `/api/v1/preferences`.

## Estructura interna

- `application/dtos`: contratos para crear, reemplazar, actualizar parcialmente y responder preferencias.
- `application/use_case`: casos de uso CRUD.
- `domain`: entidad `Preference`, contrato del repositorio y errores del dominio.
- `infrastructure/controllers`: controlador HTTP de Fastify.
- `infrastructure/repositories/drizzle`: implementacion del repositorio con Drizzle ORM.
- `infrastructure/schemas`: tabla `preferences`.
- `infrastructure/swagger`: definicion Swagger del modulo.

## Campos principales

| Campo | Tipo | Uso |
| --- | --- | --- |
| `id` | `uuid` | Identificador generado por la base de datos. |
| `language` | `string` | Idioma preferido. |
| `notificationEmail` | `boolean` | Activa o desactiva notificaciones por email. |
| `notificationPush` | `boolean` | Activa o desactiva notificaciones push. |
| `doubleAuthentication` | `boolean` | Activa o desactiva doble autenticacion. |
| `idUser` | `uuid` | Usuario propietario de las preferencias. |
| `createdAt` | `Date` | Fecha de creacion. |
| `updatedAt` | `Date` | Fecha de actualizacion. |

`idUser` referencia a `users.id` con cascada en update y delete.

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/api/v1/preferences` | Lista preferencias. Requiere header `apikey: 123456`. |
| `POST` | `/api/v1/preferences/create` | Crea preferencias para un usuario. |
| `PUT` | `/api/v1/preferences/put/:id` | Reemplaza todos los campos editables de las preferencias. |
| `PATCH` | `/api/v1/preferences/patch/:id` | Actualiza uno o mas campos de las preferencias. |
| `DELETE` | `/api/v1/preferences/delete/:id` | Elimina preferencias por id. |

## Como usarlo

Crear preferencias:

```bash
curl -X POST http://localhost:3000/api/v1/preferences/create \
  -H "Content-Type: application/json" \
  -d '{
    "language": "es",
    "notificationEmail": true,
    "notificationPush": false,
    "doubleAuthentication": true,
    "idUser": "USER_UUID"
  }'
```

Listar preferencias:

```bash
curl http://localhost:3000/api/v1/preferences \
  -H "apikey: 123456"
```

Actualizar parcialmente:

```bash
curl -X PATCH http://localhost:3000/api/v1/preferences/patch/PREFERENCE_UUID \
  -H "Content-Type: application/json" \
  -d '{
    "notificationPush": true
  }'
```

## Respuestas y errores

Las respuestas exitosas usan esta forma:

```json
{
  "ok": true,
  "message": "Preference created successfully",
  "body": {}
}
```

Errores controlados:

- `404`: preferencias no encontradas.
- `422`: datos invalidos, por ejemplo un `PATCH` sin campos.
- `500`: error inesperado.

## Notas de implementacion

- `POST` y `PUT` requieren `language`, `notificationEmail`, `notificationPush`, `doubleAuthentication` e `idUser`.
- `PATCH` permite enviar solo los campos que se quieren cambiar.
- Si se elimina un usuario, sus preferencias se eliminan por cascada desde la base de datos.
