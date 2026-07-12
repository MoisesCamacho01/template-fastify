# Instalación y configuración

## Requisitos

- Node.js `>=22` y npm.
- PostgreSQL con acceso para crear el enum y las tablas de la migración.
- Redis compatible con RESP2 y autenticación opcional por contraseña.
- ClickHouse accesible por su interfaz HTTP.

ClickHouse es necesario al arrancar: el registrador se construye durante la carga de la aplicación y valida todas sus variables. Si ClickHouse no responde después del arranque, la petición continúa y el error de auditoría se escribe en `stderr`.

## Instalación local

```bash
npm install
cp .env-example .env
npx drizzle-kit migrate
npm run dev
```

`drizzle.config.ts` lee `POSTGRES_URL`, usa `src/db/schema/schema.ts` como fuente y guarda migraciones en `drizzle/`.

Para generar una migración después de cambiar el esquema:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Variables de entorno

| Variable | Requerida | Predeterminado | Uso |
| --- | --- | --- | --- |
| `PORT` | No | `3000` al escuchar; `4000` en OpenAPI | Puerto HTTP. Conviene definirla siempre para evitar esa diferencia. |
| `DOMAIN` | No | `http://localhost` | Origen publicado en el servidor OpenAPI. |
| `NODE_ENV` | No | — | Si vale `dev`, OpenAPI añade `PORT` a `DOMAIN` cuando el dominio no tiene puerto. |
| `NOVE_ENV` | No | — | Alias legado de `NODE_ENV`; también se guarda en auditoría. |
| `POSTGRES_URL` | Sí | — | Cadena PostgreSQL usada por Drizzle, autenticación y migraciones. |
| `REDIS_HOST` | Sí | — | Host TCP de Redis. |
| `REDIS_PORT` | No | `6379` | Puerto TCP de Redis. |
| `REDIS_PASSWORD` | No | vacío | Se envía mediante `AUTH` si no está vacía. |
| `CH_HOST` | Sí | — | Host o URL HTTP(S) de ClickHouse. |
| `CH_PORT` | Sí en la validación | `8123` | Puerto HTTP de ClickHouse. |
| `CH_DB_NAME` | Sí | — | Base de datos de auditoría. |
| `CH_DB_USER` | Sí | — | Usuario para autenticación Basic. |
| `CH_DB_PASSWORD` | Sí | — | Contraseña para autenticación Basic. |
| `OIDC_KEY_ID` | No | `login-api-rs256` | `kid` de las utilidades RS256. |
| `OIDC_PRIVATE_KEY` | No | clave efímera | PEM PKCS#8; admite saltos codificados como `\\n`. |
| `OIDC_PUBLIC_KEY` | No | derivada de la privada | PEM SPKI para exportar el JWK. |

Las variables `DB_*`, `DATABASE_URL`, MongoDB, SMTP, OAuth, frontend y `SECRET_JWT` de versiones anteriores no son consumidas por el código 3.0.0.

## PostgreSQL

La migración `drizzle/0000_small_dexter_bennett.sql` crea:

- `users`: nombre único, hash BCrypt, estado `ACTIVE|INACTIVE` y marcas de tiempo.
- `sessions`: usuario, código único, IP, agente de usuario, expiración y revocación.

## ClickHouse

Antes de enviar tráfico, crea la tabla que espera el registrador:

```sql
CREATE TABLE endpoint_response_logs
(
  id UUID,
  request_id UUID,
  service String,
  environment String,
  api_version String,
  method String,
  route String,
  path String,
  query_string String,
  ip String,
  user_agent String,
  id_user String,
  status_code UInt16,
  response_time_ms UInt64,
  response_content_type String,
  response_body String,
  response_body_size UInt64,
  response_hash FixedString(64),
  error_name String,
  error_message String,
  created_at DateTime
)
ENGINE = MergeTree
ORDER BY (created_at, service, route);
```

## Servidores con Docker

El directorio `servidores-docker/` contiene composiciones independientes para los tres servidores requeridos. No es necesario instalar PostgreSQL, Redis o ClickHouse directamente en el sistema operativo.

| Servidor | Imagen | Contenedor | Puertos publicados | Persistencia |
| --- | --- | --- | --- | --- |
| PostgreSQL | `postgres:17.6-alpine3.22` | `postgress` | `5432` | `postgres_data` |
| Redis | `redis:7-alpine` | `redis` | `6379` | `redis_data` |
| ClickHouse | `clickhouse/clickhouse-server:latest` | `clickhouse` | `8123` HTTP y `9000` nativo | `clickhouse_data` |

### 1. Levantar la infraestructura

Ejecuta los comandos desde la raíz del proyecto:

```bash
docker compose -f servidores-docker/Postgress/docker-compose.yml --env-file servidores-docker/Postgress/.env up -d
docker compose -f servidores-docker/Redis/docker-compose.yml up -d
docker compose -f servidores-docker/Clickhouse/docker-compose.yml up -d
```

Comprueba el estado:

```bash
docker compose -f servidores-docker/Postgress/docker-compose.yml --env-file servidores-docker/Postgress/.env ps
docker compose -f servidores-docker/Redis/docker-compose.yml ps
docker compose -f servidores-docker/Clickhouse/docker-compose.yml ps
```

Las credenciales incluidas para desarrollo son:

| Servicio | Base de datos | Usuario | Contraseña |
| --- | --- | --- | --- |
| PostgreSQL | `db_default` | `admin` | `12345` |
| Redis | — | — | `StrongPassword123` |
| ClickHouse | `default` inicialmente | `admin` | `admin123` |

Estas credenciales son públicas dentro del repositorio y solo son apropiadas para desarrollo local.

### 2. Preparar ClickHouse

La composición crea el servidor, pero no la base `login_api` ni la tabla de auditoría. Créala mediante la interfaz HTTP:

```bash
curl -u admin:admin123 "http://localhost:8123/?query=CREATE%20DATABASE%20IF%20NOT%20EXISTS%20login_api"
```

Después ejecuta en `login_api` el `CREATE TABLE endpoint_response_logs` documentado en la sección anterior. También puedes cambiar `CH_DB_NAME` a `default` y crear allí la tabla.

### 3. Configurar la API ejecutada localmente

Si ejecutas `npm run dev` desde el host, usa en `.env`:

```dotenv
POSTGRES_URL=postgresql://admin:12345@localhost:5432/db_default?schema=public

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=StrongPassword123

CH_HOST=localhost
CH_PORT=8123
CH_DB_NAME=login_api
CH_DB_USER=admin
CH_DB_PASSWORD=admin123
```

Aplica la migración y arranca:

```bash
npx drizzle-kit migrate
npm run dev
```

### 4. Ejecutar también la API en Docker

La composición raíz construye la imagen `login-api:latest` y monta el código para recarga en desarrollo:

```bash
docker network create dev-net
docker compose -f docker-compose.dev.yml up -d --build
```

La red `dev-net` es externa; el comando para crearla solo se necesita una vez. Los servidores independientes publican sus puertos en el host, por lo que la API en Docker debe usar `host.docker.internal`, no `localhost`:

```dotenv
POSTGRES_URL=postgresql://admin:12345@host.docker.internal:5432/db_default?schema=public
REDIS_HOST=host.docker.internal
REDIS_PORT=6379
REDIS_PASSWORD=StrongPassword123
CH_HOST=host.docker.internal
CH_PORT=8123
CH_DB_NAME=login_api
CH_DB_USER=admin
CH_DB_PASSWORD=admin123
```

Aplica la migración desde el host antes de iniciar la API, o ejecútala explícitamente dentro del contenedor cuando este ya esté activo:

```bash
docker compose -f docker-compose.dev.yml exec login-api npx drizzle-kit migrate
```

### Detener los servicios

```bash
docker compose -f docker-compose.dev.yml down
docker compose -f servidores-docker/Postgress/docker-compose.yml --env-file servidores-docker/Postgress/.env down
docker compose -f servidores-docker/Redis/docker-compose.yml down
docker compose -f servidores-docker/Clickhouse/docker-compose.yml down
```

Los volúmenes nombrados conservan los datos después de `down`. No añadas `-v` salvo que quieras eliminarlos deliberadamente.
