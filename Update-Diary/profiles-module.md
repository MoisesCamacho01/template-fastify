# Modulo Profiles

Este modulo administra perfiles de usuario. Vive en `src/app/modules/profiles` y esta conectado a la ruta base `/api/v1/profiles`.

## Estructura interna

- `application/dtos`: contratos para crear, reemplazar, actualizar parcialmente y responder perfiles.
- `application/use_case`: casos de uso CRUD.
- `domain`: entidad `Profile`, generos aceptados, contrato del repositorio y errores del dominio.
- `infrastructure/controllers`: controlador HTTP de Fastify.
- `infrastructure/repositories/drizzle`: implementacion del repositorio con Drizzle ORM.
- `infrastructure/schemas`: tabla `profiles`.
- `infrastructure/swagger`: definicion Swagger del modulo.

## Campos principales

| Campo | Tipo | Uso |
| --- | --- | --- |
| `id` | `uuid` | Identificador generado por la base de datos. |
| `name` | `string` | Nombre del usuario. |
| `lastName` | `string` | Apellido del usuario. |
| `extPhone` | `string` | Extension o prefijo telefonico. |
| `phone` | `string` | Telefono. |
| `gender` | `string` | Genero aceptado por el dominio. |
| `birthday` | `string` | Fecha de nacimiento en formato `YYYY-MM-DD`. |
| `profilePhoto` | `string` | URL o referencia de foto de perfil. |
| `biography` | `string` | Biografia del usuario. |
| `idUser` | `uuid` | Usuario propietario del perfil. |
| `createdAt` | `Date` | Fecha de creacion. |
| `updatedAt` | `Date` | Fecha de actualizacion. |

Generos aceptados actualmente:

- `Male`
- `Famale`

Usa exactamente esos valores, porque son los definidos en el dominio y en Swagger.

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/api/v1/profiles` | Lista perfiles. Requiere header `apikey: 123456`. |
| `POST` | `/api/v1/profiles/create` | Crea un perfil. |
| `PUT` | `/api/v1/profiles/put/:id` | Reemplaza todos los campos editables del perfil. |
| `PATCH` | `/api/v1/profiles/patch/:id` | Actualiza uno o mas campos del perfil. |
| `DELETE` | `/api/v1/profiles/delete/:id` | Elimina un perfil por id. |

## Como usarlo

Crear perfil:

```bash
curl -X POST http://localhost:3000/api/v1/profiles/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana",
    "lastName": "Perez",
    "extPhone": "+593",
    "phone": "0999999999",
    "gender": "Male",
    "birthday": "1995-04-20",
    "profilePhoto": "https://example.com/photo.png",
    "biography": "Perfil de prueba",
    "idUser": "USER_UUID"
  }'
```

Listar perfiles:

```bash
curl http://localhost:3000/api/v1/profiles \
  -H "apikey: 123456"
```

Actualizar parcialmente:

```bash
curl -X PATCH http://localhost:3000/api/v1/profiles/patch/PROFILE_UUID \
  -H "Content-Type: application/json" \
  -d '{
    "biography": "Nueva biografia"
  }'
```

## Respuestas y errores

Las respuestas exitosas usan esta forma:

```json
{
  "ok": true,
  "message": "Profile created successfully",
  "body": {}
}
```

Errores controlados:

- `404`: perfil no encontrado.
- `422`: datos invalidos, por ejemplo un `PATCH` sin campos.
- `500`: error inesperado.

## Notas de implementacion

- `POST` y `PUT` requieren todos los campos principales.
- `PATCH` permite enviar solo los campos que se quieren cambiar.
- `idUser` referencia a `users.id`; si el usuario se elimina, el perfil queda cubierto por la cascada de la base de datos.
