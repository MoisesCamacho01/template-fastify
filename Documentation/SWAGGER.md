# Documentación con Swagger

Este template utiliza Swagger (OpenAPI) para documentar automáticamente los endpoints de la API. Esto permite a otros desarrolladores entender fácilmente cómo interactuar con tu API, los parámetros esperados, las respuestas posibles y los códigos de estado.

## Propósito de la Documentación Swagger

La documentación generada con Swagger proporciona una interfaz interactiva y visual de todos los endpoints de tu API. Es crucial para:

*   Facilitar la integración por parte de consumidores de la API.
*   Servir como referencia clara y actualizada de los servicios disponibles.
*   Ayudar en el proceso de desarrollo y pruebas.

## Archivos de Configuración Global

La configuración global de Swagger para el proyecto se encuentra en la carpeta `swagger/`. Dentro de esta carpeta, puedes encontrar archivos que definen aspectos generales de la documentación, como la información de la API (título, versión), definiciones de seguridad y esquemas reutilizables.

*   `swagger/swagger.json`: Este archivo contiene la estructura principal de la definición de Swagger, incluyendo la información base de la API y posiblemente referencias a otras definiciones.
*   `swagger/methods.json`: Contiene definiciones comunes o ejemplos para diferentes métodos HTTP.
*   `swagger/httpCode.json`: Define respuestas comunes para diferentes códigos de estado HTTP.

Estos archivos actúan como plantillas o definiciones base que se utilizan al generar la documentación completa.

## Cómo Definir Operaciones (Rutas, Parámetros, Respuestas)

La documentación de operaciones individuales (endpoints específicos) se integra directamente con la definición de las rutas. Dentro de los archivos donde defines tus rutas (como los archivos en `src/app/routes/v1/routes/`), debes incluir bloques de comentarios o estructuras de datos específicas que sigan el formato OpenAPI.

Aunque la implementación exacta puede variar ligeramente dependiendo de cómo esté configurado el template, generalmente involves añadir propiedades `schema` a la definición de la ruta de Fastify. Estas propiedades `schema` describen:

*   `summary`: Un resumen corto de la operación.
*   `description`: Una descripción más detallada.
*   `tags`: Para agrupar operaciones relacionadas.
*   `params`, `querystring`, `body`, `headers`: Definiciones de los parámetros esperados en cada parte de la petición.
*   `response`: Definiciones de las posibles respuestas, incluyendo códigos de estado y la estructura del cuerpo de la respuesta.
*   `security`: Especifica si la operación requiere autenticación u otro tipo de seguridad.

Consulta los archivos de ruta existentes (por ejemplo, `src/app/routes/v1/routes/user.routes.ts`) para ver ejemplos de cómo se implementa la documentación Swagger a nivel de ruta en este template.

## Generación y Mantenimiento de las Definiciones

La forma en que se generan o se mantienen las definiciones de Swagger puede variar:

*   **Generación automática:** Algunos templates utilizan herramientas (como plugins de Fastify o scripts) que escanean el código y generan el archivo `swagger.json` basado en los esquemas que defines en tus rutas.
*   **Mantenimiento manual o semi-automático:** En otros casos, puedes necesitar actualizar manualmente partes del archivo `swagger.json` o utilizar scripts personalizados para combinar las definiciones a nivel de ruta con la configuración global.

Este template parece utilizar la integración directa en las definiciones de ruta, lo que sugiere una generación automática o un proceso que compila estas definiciones en un único archivo `swagger.json` servible. Revisa el archivo `src/core/swagger/swagger.ts` y posiblemente el archivo `src/app/swagger/user.swagger.ts` (si es una plantilla) para entender el mecanismo exacto de generación.

Revisa la documentacion de `Emily` para saber como crear una `entity-swagger` que es el esquema que usa cada ruta.

## Visualización de la Documentación

Una vez que el servidor Fastify esté corriendo, la documentación interactiva de Swagger UI suele estar disponible en una ruta específica. Comúnmente, se accede a través de la ruta `/documentation` o `/doc`.

Abre tu navegador y navega a la URL donde se está ejecutando tu aplicación Fastify, seguido de la ruta de documentación. Por ejemplo:

`http://localhost:3000/doc` (si tu aplicación corre en el puerto 3000)

Aquí podrás explorar todos los endpoints documentados, probar las peticiones directamente desde el navegador y ver los detalles de cada operación.