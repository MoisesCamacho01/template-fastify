# Configuración del Proyecto

Este documento explica los pasos necesarios para configurar y poner en marcha este template.

## 1. Clonar el Repositorio

Para obtener el código fuente del proyecto, abre tu terminal y ejecuta el siguiente comando:

```bash
git clone https://github.com/MoisesCamacho01/template-fastify.git
```
```cmd
cd <NOMBRE_DEL_DIRECTORIO_DEL_PROYECTO>
```
Reemplaza `<NOMBRE_DEL_DIRECTORIO_DEL_PROYECTO>` con el nombre del directorio donde se clonó el proyecto.

## 2. Instalar Dependencias

Una vez que hayas clonado el repositorio y te encuentres en el directorio del proyecto, instala las dependencias necesarias utilizando npm:
```bash
npm install
```
Esto descargará e instalará todos los paquetes listados en `package.json`.

## 3. Configurar Variables de Entorno

El proyecto utiliza variables de entorno para gestionar configuraciones sensibles y específicas del entorno. Estas variables se cargan desde un archivo `.env` en la raíz del proyecto.

Para empezar, copia el archivo de ejemplo `.env-example` a un nuevo archivo llamado `.env`:
```bash
cp .env-example .env
```
Ahora, abre el archivo `.env` que acabas de crear con tu editor de texto preferido. Este archivo contiene variables de ejemplo que debes configurar según tu entorno.

Es crucial entender la importancia del archivo `.env`. **No debes** subir este archivo a sistemas de control de versiones como Git, ya que puede contener información sensible como claves de API, credenciales de base de datos, etc. El archivo `.env-example` solo proporciona la estructura y nombres de las variables esperadas.

Asegúrate de revisar y configurar las siguientes variables clave:

* `PORT`: El puerto en el que se ejecutará el servidor de la aplicación. Por ejemplo: `PORT=3000`.

Configura cualquier otra variable presente en `.env` según sea necesario para tu entorno (por ejemplo, variables relacionadas con la base de datos, servicios externos, etc.).

Una vez que hayas configurado el archivo `.env`, el proyecto estará listo para ser ejecutado. Consulta la documentación sobre cómo ejecutar el proyecto para continuar.