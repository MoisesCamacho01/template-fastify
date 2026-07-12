# Extender el mini-framework

## Crear un módulo

Replica la separación de `modules/auth`:

1. Define entidades, errores y puertos en `domain/` sin dependencias de Fastify o Drizzle.
2. Implementa los casos de uso en `application/` recibiendo puertos por constructor.
3. Crea adaptadores, controladores, esquemas y rutas en `infrastructure/`.
4. Compón las implementaciones en el archivo de rutas.
5. Registra el módulo desde `src/app/routes/v1/index.routes.ts`.

Ejemplo mínimo de ruta protegida:

```ts
import type { FastifyInstance } from "fastify";
import type { AuthenticatedUserContext } from "@/core/middleware/middleware";

export default async function profileRoutes(app: FastifyInstance) {
  app.get("/me", async (request) => {
    const user = (request as typeof request & { user: AuthenticatedUserContext }).user;
    return { ok: true, message: "Profile", body: user };
  });
}
```

Regístrala sin barra inicial para mantener una composición predecible:

```ts
route.register(profileRoutes, { prefix: "profile" });
```

Al estar fuera de `/auth`, el hook v1 exige Bearer automáticamente. Importante: la exclusión actual usa coincidencia textual con `/auth/`; evita rutas no-auth que contengan ese fragmento y endurece la regla si amplías el framework.

## Añadir tablas

Define tablas y relaciones en `src/db/schema/schema.ts`, luego ejecuta:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Usa `POSTGRES_URL` en todos los adaptadores para mantener una sola configuración.

## Documentar rutas

Para una ruta concreta, devuelve `RouteShorthandOptions` como hace `AuthSwagger` y pásalo como segundo argumento de `get`, `post`, etc. Define `body`, `params`, `querystring`, respuestas y seguridad con JSON Schema compatible con Fastify.

El constructor genérico `Swagger` también puede crear plantillas CRUD. Implementa `EntitySwaggerRepository`, llama `await swagger.entity(repository)` y usa `swagger.get`, `swagger.post`, `swagger.put`, `swagger.patch` o `swagger.del`. Las plantillas son estado mutable por instancia: crea una instancia por entidad y llama `entity` antes de registrar rutas.

## Usar Redis

```ts
const redis = new RedisDatabase();
await redis.set("key", "value", 60);
const value = await redis.get("key");
await redis.del("key");
```

No pases comandos que devuelvan arrays ni mapas: el parser actual no soporta esos tipos RESP. Para cargas altas, reemplaza este adaptador por un cliente con pool/conexiones persistentes manteniendo el puerto de dominio.

## Usar ClickHouse

```ts
const clickhouse = new ClickHouseDatabase();
await clickhouse.command("CREATE TABLE IF NOT EXISTS events (id UUID) ENGINE = MergeTree ORDER BY id");
await clickhouse.insertJsonEachRow("events", [{ id: crypto.randomUUID() }]);
```

Los valores de parámetros se envían como `param_<nombre>`; referencia `{nombre:Tipo}` en SQL. Los nombres de tabla de `insertJsonEachRow` se interpolan directamente: deben ser constantes internas, nunca entrada del usuario.

## Usar las utilidades RS256

```ts
const token = signJwtRs256({ sub: user.id, exp: 1893456000 });
const jwk = getPublicJwk();
```

La utilidad solo firma; no añade ni valida claims, no verifica tokens y no publica endpoints. Configura una clave persistente y diseña validación completa antes de exponerla.

## Versionar la API

Añade un router paralelo y pásalo a OpenAPI:

```ts
sw.getOpenApi(["v1", "v2"], (data) => { /* registrar plugins y routers */ });
app.register(routesV2, { prefix: "/api/v2" });
```

Mantén controladores y DTO separados cuando el contrato cambie; no reutilices una versión si altera el comportamiento de clientes existentes.
