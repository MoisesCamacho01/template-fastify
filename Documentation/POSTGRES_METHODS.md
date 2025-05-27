# Métodos de PostgreSQL en Modelos

Esta documentación describe cómo utilizar los métodos proporcionados por la clase base `Model` para interactuar con la base de datos PostgreSQL en los modelos de la aplicación.

## Clase Base `Model`

Todos los modelos de la aplicación deben extender la clase base `Model`. Esta clase proporciona una abstracción para construir y ejecutar consultas SQL contra la base de datos PostgreSQL.

## Configuración de la Tabla

Dentro del constructor de cada modelo, es necesario establecer la propiedad `this.table` con el nombre exacto de la tabla de la base de datos a la que corresponde el modelo.
```typescript
constructor(app: FastifyInstance) {
    super(app);
    this.table = 'nombre_de_la_tabla'; // Establece el nombre de la tabla
}
```
## Métodos Disponibles

La clase `Model` proporciona varios métodos para construir y ejecutar consultas SQL:

### `select(...fields: string[])`

Define los campos que se seleccionarán en una consulta `SELECT`.

*   **Propósito:** Especificar qué columnas se recuperarán de la tabla.
*   **Uso:** Llama al método `select` con un string de nombres de los campos como argumento de cadena. Si no se proporcionan argumentos, se seleccionarán todos los campos (`*`).
*   **Ejemplo:**
```typescript
    this.select('id, nombre, email');
    this.select('*');
    this.select();
    
```
### `where(conditions: WhereInterface[])`

Agrega una o más condiciones `WHERE` a la consulta.

*   **Propósito:** Filtrar los registros que se incluirán en los resultados de la consulta.
*   **Uso:** Llama al método `where` con un array de objetos que implementan la interfaz `WhereInterface`. Cada objeto define un campo, un operador y un valor para la condición.
*   **`WhereInterface`:**
```typescript
    interface WhereInterface {
      field: string;
      operator: string; // Ej: '=', '>', '<', '>=', '<=', '!=', 'LIKE', 'IN'
      value: any;
    }
    
```
*   **Ejemplo:**
```typescript
    this.where([
        { field: 'id', operator: '=', value: 1 },
        { field: 'estado', operator: 'LIKE', value: 'activo%' }
    ]);
    
```
### `execute(): Promise<MessageInterface>`

Ejecuta la consulta SQL construida con los métodos anteriores.

*   **Propósito:** Enviar la consulta a la base de datos y obtener el resultado.
*   **Uso:** Llama al método `execute` después de haber configurado la consulta con métodos como `select`, `where`, `insert`, `update` o `delete`. Es una operación asíncrona y devuelve una Promesa.
*   **Retorna:** Una Promesa que se resuelve con un objeto `MessageInterface` que contiene el resultado de la operación de base de datos, incluyendo información de éxito/error y mensajes.
*   **Ejemplo:**
```typescript
    let resultado: MessageInterface = await this.execute(); 
```
### `insert(data: T): Promise<MessageInterface>`

Prepara una consulta `INSERT` con los datos proporcionados.

*   **Propósito:** Agregar un nuevo registro a la tabla.
*   **Uso:** Llama al método `insert` con un objeto que representa los datos del nuevo registro. El tipo `T` representa la estructura de los datos del modelo.
*   **Retorna:** Una Promesa que se resuelve con un objeto `MessageInterface`.
*   **Ejemplo:**
```typescript
    let nuevoRegistro = { nombre: 'Juan', edad: 30 };
    let resultadoInsert: MessageInterface = await this.insert(nuevoRegistro);
```
### `update(data: Partial<T>): Promise<MessageInterface>`

Prepara una consulta `UPDATE` con los datos proporcionados.

*   **Propósito:** Modificar los datos de uno o varios registros existentes en la tabla.
*   **Uso:** Llama al método `update` con un objeto que contiene los campos y valores a actualizar. Se utiliza `Partial<T>` para indicar que no todos los campos del modelo son necesarios para la actualización. Este método debe ser seguido por un método `where` y `execute` para especificar qué registros actualizar.
*   **Retorna:** Una Promesa que se resuelve con un objeto `MessageInterface`.
*   **Ejemplo:**
```typescript
    this.update({ estado: 'inactivo' });
    this.where([
        { field: 'id', operator: '=', value: 5 }
    ]);
    let resultadoUpdate: MessageInterface = await this.execute();
```
### `delete(): void`

Prepara una consulta `DELETE`.

*   **Propósito:** Eliminar registros de la tabla.
*   **Uso:** Llama al método `delete` para indicar que la operación es una eliminación. Este método debe ser seguido por un método `where` y `execute` para especificar qué registros eliminar. Si no se utiliza `where`, se eliminarán todos los registros de la tabla.
*   **Ejemplo:**
```typescript
    this.delete();
    this.where([
        { field: 'id', operator: '=', value: 10 }
    ]);
    let resultadoDelete: MessageInterface = await this.execute(); 
```
## Ejemplos de Uso en Operaciones Comunes

Basado en el `ExampleModel`, aquí se muestran ejemplos de cómo combinar los métodos para realizar operaciones comunes:

### `find(id: string)` (Buscar por ID de usuario)
```typescript
public find = async (id: string) => {
    try {
        this.select('*'); // Seleccionar todos los campos
        this.where([      // Agregar condición WHERE por id
            {
                field: 'id',
                operator: '=',
                value: id
            }
        ]);

        let getExample: MessageInterface = await this.execute(); // Ejecutar la consulta

        if (getExample.error) {
            console.log({
                consult_user: getExample.message
            });
            getExample.message = "Error retrieving data";
        }

        return getExample;

    } catch (error) {
        return this.getResponse({ error: true, message: error })
    }
}
```
### `create(example: ExampleInterface)` (Crear un nuevo registro)
```typescript
public create = async (example: ExampleInterface) => {
    try {
        let insert: MessageInterface = await this.insert(preference); // Insertar los datos

        if (insert.error) {
            console.log({
                Insert_user: insert.message
            });
            insert.message = "Error in insertion of data";
        }

        return insert;
    } catch (error) {
        return this.getResponse({ error: true, message: error });
    }
}
```
### `path(id: string, example: ExampleInterface)` (Actualizar por ID el registro)
```typescript
public path = async (id: string, example: ExampleInterface) => {
    try {
        this.update(example); // Preparar la actualización con los nuevos datos
        this.where([           // Agregar condición WHERE por id
            {
                field: 'id',
                operator: '=',
                value: id
            }
        ]);
        let update: MessageInterface = await this.execute(); // Ejecutar la actualización
        if (update.error) {
            console.log({
                Insert_user: update.message
            });
            update.message = "Error in update of data";
        }
        return update

    } catch (error) {
        return this.getResponse({ error: true, message: error })
    }
}
```
### `del(id: string)` (Eliminar por ID de usuario)
```typescript
public del = async (id: string) => {
    try {
        this.delete(); // Preparar la eliminación
        this.where([   // Agregar condición WHERE por id
            {
                field: 'id',
                operator: '=',
                value: id
            }
        ]);

        let deleteExample: MessageInterface = await this.execute(); // Ejecutar la eliminación

        if (deleteExample.error) {
            console.log({
                Insert_user: deleteExample.message
            });
            deleteExample.message = "Error in update of data";
        }

        return deleteExample;
    } catch (error) {
        return this.getResponse({ error: true, message: error });
    }
}
```
## Manejo de Errores y Tipo de Respuesta

Es fundamental manejar los posibles errores que puedan ocurrir durante las operaciones de base de datos. Los métodos que ejecutan consultas (`execute`, `insert`, `update`) devuelven un objeto de tipo `MessageInterface` que contiene información sobre el resultado de la operación, incluyendo si hubo un error (`error: boolean`) y un mensaje asociado (`message: any`).

Se recomienda verificar la propiedad `error` en la respuesta para determinar si la operación fue exitosa y manejar los errores adecuadamente, ya sea registrándolos o devolviendo un mensaje de error al cliente.