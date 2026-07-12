# Arquitectura

## Estructura

```text
src/
├── index.ts                         arranque y escucha HTTP
├── app/
│   ├── app.ts                       composición de Fastify y plugins
│   ├── routes/v1/                   router y política de autenticación
│   └── modules/auth/
│       ├── application/             DTO y casos de uso
│       ├── domain/                  puertos, entidades y errores
│       └── infrastructure/          HTTP, Drizzle, BCrypt, Redis y Swagger
├── core/
│   ├── database/                    clientes Redis y ClickHouse
│   ├── logs/                        auditoría de respuestas
│   ├── middleware/                  autenticación Bearer
│   ├── security/                    firma RS256 y JWK
│   └── swagger/                     constructor genérico de esquemas
└── db/schema/                       esquema Drizzle
```

## Composición

`app.ts` crea Fastify con logs nativos, registra CORS, instala la auditoría, carga OpenAPI y, dentro de su callback, registra Swagger UI y las rutas v1. El módulo auth compone manualmente sus dependencias; no usa contenedor de inyección.

## Flujo de registro

1. Fastify valida `username` y `password` con el esquema de `AuthSwagger`.
2. `AuthController.register` invoca `Register.execute`.
3. El caso de uso consulta el puerto `AuthIdentityRepository`.
4. Si el usuario no existe, `PasswordHasher` genera el hash.
5. `DrizzleAuthIdentityRepository` inserta la fila y devuelve datos públicos.
6. El controlador traduce errores de dominio a HTTP.

## Flujo de login

1. Se busca el usuario y se exige estado `ACTIVE`.
2. `PasswordVerifier` comprueba BCrypt.
3. PostgreSQL crea una sesión de 24 horas con IP y `User-Agent`.
4. `CryptoTokenGenerator` crea 48 bytes aleatorios y los serializa en hexadecimal.
5. Redis guarda el contexto durante 86 400 segundos.
6. El token opaco y la fecha de expiración se devuelven al cliente.

No es un JWT: el servidor necesita Redis para resolverlo. La utilidad RS256 es independiente del login actual.

## Auditoría de endpoints

Los hooks globales registran inicio, error y respuesta. Cada respuesta intenta insertar en ClickHouse método, ruta, URL, consulta, IP, agente, estado, duración, tipo y cuerpo de respuesta, tamaño, SHA-256 y datos del error.

La auditoría no interrumpe la respuesta si la inserción falla. Actualmente `id_user` se toma del header `x-user-id`, no del contexto autenticado, y los cuerpos se almacenan completos: no devuelvas secretos ni datos personales sin añadir redacción.

## Adaptadores de infraestructura

- `RedisDatabase`: cliente TCP RESP2 mínimo con `PING`, `GET`, `SET`, `DEL`, `EXPIRE` y `command`. Abre una conexión por comando, timeout de 5 segundos y solo soporta respuestas simple-string, integer y bulk-string.
- `ClickHouseDatabase`: usa `fetch` y Basic Auth; ofrece `ping`, consultas `JSONEachRow`, comandos e inserciones JSON.
- `Swagger`: clona plantillas JSON y construye esquemas CRUD genéricos desde `EntitySwaggerRepository`.
- `oidc-key-pair`: firma objetos como JWT RS256 y exporta un JWK público. Si no hay PEM, genera un par efímero en memoria; no debe usarse así para tokens que sobrevivan reinicios.

## Modelo de datos activo

`users.id` y `sessions.id` son UUID generados por PostgreSQL. `sessions.id_user` referencia `users.id`. No hay eliminación en cascada. `revoked_at` existe, aunque esta versión no expone una operación de logout que lo actualice.
