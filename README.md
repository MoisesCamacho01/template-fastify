# Template Fastify 3.0.0

Mini-framework para crear APIs con Fastify 5, TypeScript y arquitectura hexagonal. La versión 3.0.0 incluye un módulo de autenticación funcional, persistencia con PostgreSQL/Drizzle, tokens opacos en Redis, auditoría de respuestas en ClickHouse y documentación OpenAPI.

> Esta documentación describe exclusivamente el código incluido en la versión 3.0.0. Las carpetas `Update-Diary/` y `sql/db1.sql` son material histórico y no representan la API activa.

## Funcionalidad incluida

- Registro de usuarios con contraseñas BCrypt.
- Inicio de sesión y creación de sesiones de 24 horas.
- Tokens de acceso opacos de 384 bits almacenados en Redis.
- Middleware Bearer que comprueba Redis y la sesión de PostgreSQL.
- Esquema y migraciones PostgreSQL administrados con Drizzle.
- Registro asíncrono de respuestas y errores en ClickHouse.
- CORS y Swagger UI.
- Adaptadores reutilizables para Redis y ClickHouse.
- Utilidades RS256/JWK disponibles para futuros módulos OIDC.

## Inicio rápido

Requisitos: Node.js 22 o superior, PostgreSQL, Redis y ClickHouse.

```bash
npm install
cp .env-example .env
npx drizzle-kit migrate
npm run dev
```

En PowerShell, sustituye `cp` por `Copy-Item`.

Con la configuración de ejemplo, la API queda disponible en `http://localhost:4000/api/v1` y Swagger UI en `http://localhost:4000/doc`.

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"secret123"}'

curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"secret123"}'
```

## Documentación

- [Instalación y configuración](docs/installation.md)
- [Referencia completa de la API](docs/api-reference.md)
- [Arquitectura y flujo interno](docs/architecture.md)
- [Extender el mini-framework](docs/extending.md)
- [Operación, seguridad y diagnóstico](docs/operations.md)

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Ejecuta `tsx src/index.ts` con recarga mediante Nodemon. |
| `npm run tsc` | Comprueba los tipos; la configuración actual no emite archivos. |
| `npm test` | Alias de la comprobación de tipos. No hay pruebas automatizadas adicionales. |
| `npm run lint` | Analiza el proyecto con Oxlint. |
| `npm run lint:fix` | Aplica correcciones automáticas de Oxlint. |
| `npm run format` | Formatea el repositorio con Prettier. |
| `npm start` | Intenta ejecutar `build/index.js`; requiere una compilación emisora externa porque `tsconfig.json` usa `noEmit`. |

## Alcance actual

La API activa expone únicamente `GET /api/v1/`, `POST /api/v1/auth/register` y `POST /api/v1/auth/login`. No implementa logout, refresh tokens, MFA, OAuth, OIDC HTTP, tenants, roles ni CRUD de usuarios. `src/core/security/oidc-key-pair.ts` es una utilidad interna sin rutas registradas.

Licencia: consulta [LICENSE](LICENSE).
