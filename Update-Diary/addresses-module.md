# Modulo Addresses

Este modulo administra las direcciones asociadas a usuarios. Vive en `src/app/modules/addresses` y esta conectado a la ruta base `/api/v1/addresses`.

## Estructura interna

- `application/dtos`: contratos para crear, reemplazar, actualizar parcialmente y responder direcciones.
- `application/use_case`: casos de uso CRUD.
- `domain`: entidad `Address`, contrato del repositorio y errores del dominio.
- `infrastructure/controllers`: controlador HTTP de Fastify.
- `infrastructure/repositories/drizzle`: implementacion del repositorio con Drizzle ORM.
- `infrastructure/schemas`: tabla `addresses`.
- `infrastructure/swagger`: definicion Swagger del modulo.

## Campos principales

| Campo | Tipo | Uso |
| --- | --- | --- |
| `id` | `uuid` | Identificador generado por la base de datos. |
| `country` | `string` | Pais. |
| `state` | `string` | Estado, provincia o region. |
| `city` | `string` | Ciudad. |
| `zipCode` | `string` | Codigo postal. |
| `address` | `string` | Direccion completa o linea principal. |
| `idUser` | `uuid` | Usuario propietario de la direccion. |
| `createdAt` | `Date` | Fecha de creacion. |
| `updatedAt` | `Date` | Fecha de actualizacion. |

`idUser` referencia a `users.id` con cascada en update y delete.

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/api/v1/addresses` | Lista direcciones. Requiere header `apikey: 123456`. |
| `POST` | `/api/v1/addresses/create` | Crea una direccion. |
| `PUT` | `/api/v1/addresses/put/:id` | Reemplaza todos los campos editables de la direccion. |
| `PATCH` | `/api/v1/addresses/patch/:id` | Actualiza uno o mas campos de la direccion. |
| `DELETE` | `/api/v1/addresses/delete/:id` | Elimina una direccion por id. |

## Como usarlo

Crear direccion:

```bash
curl -X POST http://localhost:3000/api/v1/addresses/create \
  -H "Content-Type: application/json" \
  -d '{
    "country": "Ecuador",
    "state": "Pichincha",
    "city": "Quito",
    "zipCode": "170101",
    "address": "Av. Principal 123",
    "idUser": "USER_UUID"
  }'
```

Listar direcciones:

```bash
curl http://localhost:3000/api/v1/addresses \
  -H "apikey: 123456"
```

Actualizar parcialmente:

```bash
curl -X PATCH http://localhost:3000/api/v1/addresses/patch/ADDRESS_UUID \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Guayaquil",
    "zipCode": "090101"
  }'
```

## Respuestas y errores

Las respuestas exitosas usan esta forma:

```json
{
  "ok": true,
  "message": "Address created successfully",
  "body": {}
}
```

Errores controlados:

- `404`: direccion no encontrada.
- `422`: datos invalidos, por ejemplo un `PATCH` sin campos.
- `500`: error inesperado.

## Notas de implementacion

- `POST` y `PUT` requieren todos los campos principales.
- `PATCH` permite enviar solo los campos que se quieren cambiar.
- Si se elimina un usuario, sus direcciones se eliminan por cascada desde la base de datos.
