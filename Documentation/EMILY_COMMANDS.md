# Comandos de Emily

Este template incluye una herramienta de línea de comandos llamada "Emily" para automatizar ciertas tareas, como la generación de código o la documentación.

## Ejecutando Comandos de Emily

Los comandos de Emily se ejecutan a través de `npm run`. La sintaxis general es la siguiente:

```bash
npm run emily <nombre_del_comando> [argumentos]
```
Donde:

*   `<nombre_del_comando>` es el nombre del comando de Emily que deseas ejecutar.
*   `[argumentos]` son los parámetros opcionales o requeridos que el comando pueda necesitar.

Puedes ver la lista de comandos disponibles revisando los archivos en la carpeta `emily/commands/`.

## Comando `swagger:entity-create`

### Propósito

El comando `swagger:entity-create` se utiliza para generar automáticamente las definiciones de Swagger/OpenAPI para una entidad específica de tu aplicación. Esto agiliza el proceso de documentación de tu API al crear estructuras base para representar tus modelos de datos en la especificación Swagger.

### Cómo Ejecutar

Para ejecutar este comando, utiliza la siguiente sintaxis:

```bash
npm run emily swagger:entity-create <nombre_de_la_entidad>
```
Donde:

*   `<nombre_de_la_entidad>` es el nombre de la entidad para la cual deseas generar las definiciones de Swagger (por ejemplo, `User`, `Product`, `Order`). Este argumento es **requerido**.

### Argumentos

*   `<nombre_de_la_entidad>`: El nombre de la entidad. Debe ser un string que represente el nombre de tu modelo o recurso.

### Qué Genera o Afecta

Al ejecutar `npm run emily swagger:entity-create <nombre_de_la_entidad>`, el comando típicamente:

*   Crea o actualiza archivos dentro de la carpeta de Swagger (`src/app/swagger/`) que contienen las definiciones del esquema de la entidad en formato Swagger/OpenAPI (YAML o JSON).
*   Estas definiciones pueden incluir la estructura de los datos de la entidad, tipos de campos, validaciones básicas, etc., que luego pueden ser referenciados en la documentación de tus endpoints API.

Este comando te ayuda a mantener tu documentación Swagger sincronizada con tus modelos de datos.