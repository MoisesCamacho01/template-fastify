# Operación, seguridad y diagnóstico

## Comprobaciones

```bash
npm test
npm run lint
```

Pruebas manuales básicas:

```bash
curl http://localhost:4000/api/v1/
curl http://localhost:4000/doc/json
```

Comprueba además que el login cree una fila en `sessions`, una clave `access-token:*` en Redis con TTL y una fila de auditoría en ClickHouse.

## Diagnóstico

### La aplicación falla antes de escuchar

- `Database URL is not defined`: falta `POSTGRES_URL`.
- `Missing Redis environment variables`: falta `REDIS_HOST` o `REDIS_PORT` no es numérico.
- `Missing ClickHouse environment variables`: completa las cinco variables `CH_*`.
- Puerto no disponible: cambia `PORT`; el arranque muestra el mensaje del error y termina sin relanzarlo.

### El registro devuelve 500

Verifica conectividad PostgreSQL y que se aplicó la migración Drizzle. El controlador oculta deliberadamente el error interno; consulta los logs de Fastify/PostgreSQL.

### El login devuelve 500

Además de PostgreSQL, comprueba Redis y su contraseña. Redis usa TCP directo, no TLS.

### Toda ruta protegida devuelve 401

Comprueba que el header sea exactamente `Bearer <token>`, que la clave no haya expirado en Redis y que `sessions.revoked_at IS NULL` y `expires_at > now()`.

### Swagger anuncia una URL incorrecta

Define juntos `PORT=4000`, `DOMAIN=http://localhost` y `NODE_ENV=dev`. En otros entornos, incluye el puerto dentro de `DOMAIN` si no usas 80/443.

## Seguridad antes de producción

- Restringe CORS a los orígenes del frontend.
- Usa TLS delante de la API, Redis y bases de datos cuando corresponda.
- No incluyas secretos en `.env` dentro de imágenes ni del control de versiones.
- Redacta tokens, contraseñas y datos personales antes del logger de respuestas.
- No confíes en `x-forwarded-for` ni `x-user-id` salvo detrás de un proxy que los limpie.
- Implementa rate limiting para registro y login.
- Añade logout/revocación, rotación y limpieza de sesiones.
- Establece límites de tamaño de cuerpo y políticas de contraseñas apropiadas.
- Usa claves OIDC persistentes si conectas las utilidades RS256.
- Añade pruebas unitarias, de integración y de contrato; `npm test` hoy solo comprueba tipos.

## Observabilidad

Fastify escribe logs estructurados a stdout. ClickHouse conserva el cuerpo completo y un hash SHA-256; configura retención y permisos de consulta conforme a la sensibilidad de los datos. La auditoría usa el nombre fijo de servicio `login-api` y la versión extraída de `/api/<versión>`.

## Limitaciones conocidas de 3.0.0

- `npm start` espera una compilación que el script `tsc` actual no genera.
- No hay health checks específicos para PostgreSQL, Redis o ClickHouse.
- No hay logout ni endpoints protegidos de ejemplo en la API pública.
- El token de acceso es opaco aunque OpenAPI conserva un esquema llamado `bearerAuth` con formato descriptivo JWT.
- La autenticación crea una conexión PostgreSQL por operación y Redis una conexión TCP por comando.
- El registrador espera una tabla ClickHouse que no forma parte de una migración automatizada.
