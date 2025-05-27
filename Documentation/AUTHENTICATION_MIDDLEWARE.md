# Middleware de Autenticación

Este template incluye un middleware de autenticación que utiliza JSON Web Tokens (JWT). Su propósito principal es proteger rutas específicas de tu aplicación, asegurando que solo las solicitudes que presenten un token JWT válido puedan acceder a ellas.

## Implementación

El middleware verifica la presencia y validez de un token JWT en el encabezado `Authorization` de cada solicitud a las rutas donde se aplica. Si el token JWT es válido y no ha expirado, la solicitud procede; de lo contrario, se rechaza con un error de autenticación.

## Obtención del JWT

Para obtener un token JWT, el cliente debe autenticarse a través del endpoint de login. En este template, existe un endpoint de login de ejemplo donde puedes autenticarte utilizando cualquier dirección de correo electrónico y la contraseña `12345`.

Archivo `.env` en la raíz de tu proyecto.
```dotenv
    SECRET_JWT=tu_clave_secreta_aqui
```
Reemplaza `tu_clave_secreta_aqui` con la clave que deseas utilizar. Esta clave debe ser mantenida en secreto y no debe ser compartida públicamente.

3.  Asegúrate de que tu aplicación cargue las variables de entorno (esto suele hacerse al inicio de la aplicación, por ejemplo, en `src/index.ts` o `src/app/app.ts`).

## Aplicar el Middleware a Rutas

Para proteger una ruta específica con este middleware, debes aplicarlo en la definición de la ruta o en un grupo de rutas. La forma exacta de aplicarlo dependerá de cómo esté estructurada la aplicación Fastify en este template, pero generalmente implica registrar el middleware (como un plugin u onRequest) antes de definir la ruta o en el ámbito del router.

Busca cómo se registran los middlewares en los archivos de rutas (por ejemplo, en `src/app/routes/v1/routes/user.routes.ts`). Deberías ver algo similar a:
``` typescript
const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', route.jwtAuth); 

  fastify.get('/protected-resource', async (request, reply) => {
    // Esta ruta ahora está protegida por el middleware de autenticación
    return { message: 'Acceso concedido a recurso protegido' };
  });

  // Otras rutas sin el hook 'preHandler' explícito en este nivel no estarían protegidas por este middleware
};

export default async function userRoutes(route: FastifyInstance, options: any) {

	const sw: UserSwagger = new UserSwagger();
	await sw.loadSchema();
	const users: UsersModel = new UsersModel(route);
	const user: UserController = new UserController(users);

	await route.addHook('onRequest', route.jwtAuth); // Aplicar el middleware a todas las rutas en esta función

  // Rutas protegidas por el middleware de autenticación
	await route.get('/', { schema: sw.get.schema }, user.list);
	await route.get('/:id', { schema: sw.find.schema }, user.find)
	await route.post('/create', { schema: sw.post.schema }, user.create);
	await route.patch('/patch/:id', { schema: sw.patch.schema }, user.patch);
	await route.delete('/delete/:id', { schema: sw.del.schema }, user.delete);

}
```
O podrías aplicarlo directamente a rutas individuales:
``` typescript

await route.get('/', {onRequest: route.jwtAuth, schema: sw.get.schema }, 
async (request, reply) => {
  // Esta ruta individual está protegida
  return { message: 'Otro recurso protegido' };
});

```
> [!IMPORTANT]
>
> El middleware de autenticación es registrado en fastify como un plugin para poder usarlo como parte de FastifyInstance.

## Comportamiento para Solicitudes No Autenticadas

Si una solicitud llega a una ruta protegida por el middleware de autenticación y no incluye una API Key válida (ya sea que falte la clave, esté mal formateada o la clave no coincida con la configurada en las variables de entorno), el middleware la interceptará y responderá con un código de estado HTTP que indica un error de autenticación, generalmente **401 Unauthorized** o **403 Forbidden**, junto con un mensaje de error apropiado.