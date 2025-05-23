# Ejecución del Proyecto

Una vez que hayas configurado el proyecto siguiendo los pasos de configuración, puedes ejecutarlo y poner en marcha el servidor.

## Iniciar el Servidor

Para iniciar el servidor en modo de desarrollo, abre una terminal en la raíz del proyecto y ejecuta el siguiente comando:

```bash
npm run dev
```
Este comando iniciará el servidor utilizando Fastify. Verás mensajes en la consola indicando que el servidor está escuchando en el puerto especificado en tu archivo `.env` (por defecto, probablemente `3000`).

## Verificar el Funcionamiento

Una vez que el servidor esté corriendo, puedes verificar su funcionamiento accediendo a la URL local en tu navegador o utilizando una herramienta como `curl` o Postman.

Por lo general, la URL será similar a esta, dependiendo del puerto que hayas configurado:

```
http://localhost:3000
```

Si todo es correcto deberías recibir una respuesta del servidor si todo está funcionando correctamente.

## Otros Comandos de Ejecución

Dependiendo de la configuración del proyecto, puede haber otros scripts de ejecución definidos en el archivo `package.json`. Algunos comunes pueden incluir:

* `npm start`: Para ejecutar el proyecto en un modo de producción.
* `npm test`: Para ejecutar las pruebas unitarias o de integración.
* `npm build`: Para compilar el proyecto si utiliza TypeScript u otro lenguaje transpilado.

Consulta el archivo `package.json` para ver todos los scripts disponibles y sus descripciones.