# Base de Datos (MongoDB)

Este template utiliza **MongoDB** como base de datos principal. Aquí se explica cómo configurar la conexión y cómo interactuar con ella.

## Configuración de la Conexión

La configuración de la conexión a la base de datos se realiza principalmente a través de **variables de entorno**.

Debes asegurarte de que tu archivo `.env` (creado a partir de `.env-example` durante la configuración inicial) contenga la variable necesaria para la URL de conexión de MongoDB.

*   **`MONGO_DB_URL`**: La URL de conexión a tu instancia de MongoDB. Ejemplo: `mongodb://localhost:27017/nombre_de_tu_base_de_datos`

Asegúrate de reemplazar `nombre_de_tu_base_de_datos` con el nombre real de la base de datos que deseas utilizar.

## Ubicación del Código Relacionado con la Base de Datos

El código encargado de establecer la conexión a MongoDB y gestionar las operaciones básicas se encuentra típicamente en el directorio:

*   `src/core/database/mongodb/`

Dentro de este directorio, encontrarás archivos relacionados con la lógica de conexión y posiblemente la configuración de modelos o esquemas si el template utiliza alguna capa de abstracción como Mongoose.

## Operaciones Básicas (CRUD)

Aunque la implementación específica de las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) dependerá de cómo se hayan estructurado los controladores y servicios en el template, la interacción con la base de datos se realizará a través del cliente de MongoDB configurado.

Normalmente, encontrarás ejemplos de estas operaciones dentro de los archivos de **controladores** (`src/app/controllers/`) o posiblemente en una capa de **servicios** o **repositorios** si el template sigue ese patrón de diseño.

Las operaciones comunes incluirán:

*   **Crear (Create):** Insertar nuevos documentos en una colección.
*   **Leer (Read):** Consultar documentos en una colección (buscar por ID, filtrar, etc.).
*   **Actualizar (Update):** Modificar documentos existentes en una colección.
*   **Eliminar (Delete):** Remover documentos de una colección.

Consulta el código fuente en los controladores y la capa de base de datos para ver ejemplos concretos de cómo se implementan estas operaciones en el template.