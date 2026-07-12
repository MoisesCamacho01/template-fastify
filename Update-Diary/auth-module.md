# Modulo Auth

Este modulo maneja login, validacion de email y recuperacion de password. Vive en `src/app/modules/auth` y esta conectado a la ruta base `/api/v1/auth`.

## Estructura interna

- `application/dtos`: contratos para login, validacion de email y recuperacion de password.
- `application/use_case`: casos de uso `Login`, `ValidateEmail` y `ForgotPassword`.
- `domain`: contratos de servicios, entidades de accesos y errores de autenticacion.
- `infrastructure/controllers`: controlador HTTP de Fastify.
- `infrastructure/repositories/drizzle`: repositorios para usuarios, accesos y fallos de login.
- `infrastructure/services`: verificador bcrypt, generador de token y email sender falso.
- `infrastructure/swagger`: definicion Swagger del modulo.

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Valida credenciales y crea un acceso activo. |
| `POST` | `/api/v1/auth/validate-email` | Verifica si existe un email registrado. |
| `POST` | `/api/v1/auth/forgot-password` | Simula el envio de correo de recuperacion. |

## Login

Campos aceptados:

| Campo | Tipo | Requerido | Uso |
| --- | --- | --- | --- |
| `email` | `string` | Si | Email del usuario. |
| `password` | `string` | Si | Password en texto plano para comparar contra bcrypt. |
| `platform` | `string` | No | Plataforma del acceso. |
| `deviceName` | `string` | No | Nombre del dispositivo. |
| `ip` | `string` | No | IP desde donde se intenta login. |
| `so` | `boolean` | No | Marca de sistema operativo. |
| `soVersion` | `string` | No | Version del sistema operativo. |
| `browser` | `string` | No | Navegador usado. |

Ejemplo:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "platform": "web",
    "deviceName": "Chrome Windows",
    "ip": "127.0.0.1",
    "browser": "Chrome"
  }'
```

Respuesta exitosa:

```json
{
  "ok": true,
  "message": "Login successfully",
  "body": {
    "token": "generated-token",
    "expiresAt": "2026-04-21T00:00:00.000Z",
    "user": {
      "id": "USER_UUID",
      "email": "user@example.com",
      "status": "active"
    }
  }
}
```

## Validar email

```bash
curl -X POST http://localhost:3000/api/v1/auth/validate-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

Si existe, responde con `exists: true` y el email encontrado.

## Recuperar password

```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

Actualmente usa `FakeEmailSender`, por lo que no envia un correo real; solo conserva el flujo de aplicacion.

## Reglas de seguridad actuales

- El token se genera con `CryptoTokenGenerator`.
- El acceso nuevo expira en 24 horas.
- Antes de crear un acceso nuevo, se revoca el acceso actual del usuario.
- Si hay 3 intentos fallidos recientes, la cuenta se bloquea temporalmente durante 5 minutos.
- Cuando se alcanza el limite de intentos, se dispara la alarma del email sender.

## Errores

- `401`: credenciales invalidas.
- `404`: email no encontrado en `validate-email` o `forgot-password`.
- `423`: cuenta temporalmente bloqueada por intentos fallidos.
- `500`: error inesperado.
