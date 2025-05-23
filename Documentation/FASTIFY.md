# Uso de Fastify y Manejo de Rutas

Este template utiliza **Fastify** como el framework web principal debido a su velocidad y bajo overhead. Esta sección explica cómo se definen, organizan y manejan las rutas, así como su integración con Swagger para la documentación de la API.

## Definición de Rutas

Las rutas en este template se definen utilizando los métodos proporcionados por Fastify (como `GET`, `POST`, `PUT`, `DELETE`, etc.) en instancias del servidor Fastify. Cada ruta especifica un método HTTP, una URL y una función handler que se ejecutará cuando se acceda a esa ruta.

Ejemplo básico de definición de ruta:

```javascript
fastify.get('/mi-ruta', (request, reply) => {
  reply.send({ hello: 'world' });
});
```
## Organización de Rutas

Para mantener el proyecto organizado, las definiciones de rutas se agrupan por funcionalidad o recurso. Típicamente, encontrarás los archivos de definición de rutas dentro del directorio `src/app/routes/`.

Dentro de `src/app/routes/`, puedes tener subdirectorios para versiones de API (como `v1`) o para recursos específicos (como `users`, `products`, etc.). Cada archivo dentro de estos directorios se encarga de definir las rutas para una parte particular de la API.

Por ejemplo, las rutas relacionadas con usuarios podrían estar definidas en `src/app/routes/v1/routes/user.routes.ts`.

## Asociación con Controladores

Para separar la lógica de ruteo de la lógica de negocio, las rutas suelen llamar a funciones definidas en **controladores**. Los controladores contienen la implementación real de lo que sucede cuando se accede a una ruta (por ejemplo, interactuar con la base de datos, realizar validaciones, etc.).

Los archivos de controladores se encuentran generalmente en el directorio `src/app/controllers/`. Un controlador para un recurso específico (como usuarios) contendría las funciones para manejar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) relacionadas con ese recurso.

Una ruta en `src/app/routes/v1/routes/user.routes.ts` podría invocar una función desde `src/app/controllers/users.controller.ts`.

## Integración con Swagger

La documentación de la API se genera utilizando **Swagger/OpenAPI**. Este template integra la documentación de Swagger directamente con la definición de las rutas.

Las definiciones de Swagger para cada ruta, incluyendo parámetros, cuerpos de solicitud, respuestas y descripciones, se especifican generalmente junto a la definición de la ruta a la que corresponden.

Puedes encontrar ejemplos de cómo se integran las definiciones de Swagger dentro de los archivos de ruta o en archivos separados dedicados a la documentación Swagger para cada recurso. Basándonos en los archivos listados, para cada recurso pueden estar ubicadas en archivos como `src/app/swagger/user.swagger.ts`. Estos archivos exportan objetos que describen las operaciones para un recurso y luego son importados en los archivos de ruta para asociarlos con las rutas correspondientes.

Esta estructura permite mantener la documentación de la API actualizada y cercana al código de las rutas y controladores.

Al definir una ruta, se añade un objeto de configuración que incluye la propiedad `schema` para definir la documentación Swagger para esa ruta específica. Este `schema` describe la operación completa para la ruta.