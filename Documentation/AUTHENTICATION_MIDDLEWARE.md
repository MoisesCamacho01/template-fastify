# Middleware de Autenticación

Este template incluye un middleware de autenticación simple basado en API Keys. Su propósito principal es proteger rutas específicas de tu aplicación, asegurando que solo las solicitudes que presenten una clave válida puedan acceder a ellas.

## Implementación

El middleware verifica la presencia y validez de una API Key en cada solicitud a las rutas donde se aplica. Si la API Key es válida, la solicitud procede; de lo contrario, se rechaza con un error de autenticación.

## Configuración de la API Key

La API Key que el middleware utiliza para validar las solicitudes se configura a través de una variable de entorno.

1.  Asegúrate de tener un archivo `.env` en la raíz de tu proyecto. Si no lo tienes, puedes crearlo basándote en el archivo `.env-example`.
2.  Define la variable de entorno para tu API Key en el archivo `.env`. Por convención, podrías usar un nombre como `API_KEY` o `AUTH_API_KEY`.
```
dotenv
    API_KEY=tu_clave_secreta_aqui
    
```
Reemplaza `tu_clave_secreta_aqui` con la clave que deseas utilizar. Esta clave debe ser mantenida en secreto y no debe ser compartida públicamente.

3.  Asegúrate de que tu aplicación cargue las variables de entorno (esto suele hacerse al inicio de la aplicación, por ejemplo, en `src/index.ts` o `src/app/app.ts`).

## Aplicar el Middleware a Rutas

Para proteger una ruta específica con este middleware, debes aplicarlo en la definición de la ruta o en un grupo de rutas. La forma exacta de aplicarlo dependerá de cómo esté estructurada la aplicación Fastify en este template, pero generalmente implica registrar el middleware (como un plugin o preHandler) antes de definir la ruta o en el ámbito del router.

Busca cómo se registran los middlewares en los archivos de rutas (por ejemplo, en `src/app/routes/v1/routes/user.routes.ts`). Deberías ver algo similar a:
``` typescript
// Ejemplo conceptual (la implementación exacta puede variar)
import { authMiddleware } from '../../../core/middleware/middleware'; // Ruta de ejemplo

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', authMiddleware); // Aplicar el middleware a todas las rutas en este plugin/archivo

  fastify.get('/protected-resource', async (request, reply) => {
    // Esta ruta ahora está protegida por el middleware de autenticación
    return { message: 'Acceso concedido a recurso protegido' };
  });

  // Otras rutas sin el hook 'preHandler' explícito en este nivel no estarían protegidas por este middleware
};
```
O podrías aplicarlo directamente a rutas individuales:
``` typescript
// Ejemplo conceptual (la implementación exacta puede variar)
import { authMiddleware } from '../../../core/middleware/middleware'; // Ruta de ejemplo

fastify.get('/another-protected-route', { preHandler: authMiddleware }, async (request, reply) => {
  // Esta ruta individual está protegida
  return { message: 'Otro recurso protegido' };
});
```
Consulta el código fuente en `src/core/middleware/middleware.ts` y en los archivos de rutas para entender la implementación específica en este template.

## Comportamiento para Solicitudes No Autenticadas

Si una solicitud llega a una ruta protegida por el middleware de autenticación y no incluye una API Key válida (ya sea que falte la clave, esté mal formateada o la clave no coincida con la configurada en las variables de entorno), el middleware la interceptará y responderá con un código de estado HTTP que indica un error de autenticación, generalmente **401 Unauthorized** o **403 Forbidden**, junto con un mensaje de error apropiado.