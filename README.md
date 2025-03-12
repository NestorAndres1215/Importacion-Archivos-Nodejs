# Proyecto de Subida de Archivos con Node.js y MySQL

Este proyecto proporciona una solución completa para la **subida**, **almacenamiento** y **recuperación** de archivos utilizando **Node.js**, **Express** y **MySQL**. Permite a los usuarios subir archivos a un servidor, almacenarlos en una base de datos y recuperarlos según sea necesario. 

## Características

- **Subida de Archivos**: Permite a los usuarios cargar archivos a través de una interfaz sencilla.
- **Almacenamiento Seguro**: Los archivos se guardan tanto en el sistema de archivos como en una base de datos MySQL, asegurando accesibilidad y persistencia.
- **Recuperación de Archivos**: Los archivos pueden ser fácilmente recuperados y descargados usando su ID.
- **Listar Archivos**: Proporciona una lista de todos los archivos almacenados en el sistema.
- **Gestión de Tipos de Archivos**: Permite restringir y validar los tipos de archivos permitidos para subir.
- **Manejo de Errores**: Implementa gestión de errores para asegurar una experiencia de usuario fluida.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución para JavaScript en el servidor.
- **Express.js** - Framework ligero para construir aplicaciones web y APIs.
- **Multer** - Middleware para la gestión de archivos en Node.js.
- **MySQL** - Sistema de gestión de bases de datos relacional.
- **Sequelize** - ORM para interactuar con la base de datos MySQL.

## Requisitos

- Tener instalado **Node.js** y **npm**.
- Tener un servidor MySQL en ejecución.

## Instalación

Clona el repositorio y ejecuta el siguiente comando para instalar las dependencias necesarias:

```sh
npm install express multer mysql2 sequelize dotenv
```

## Configuración de la Base de Datos

Antes de ejecutar el proyecto, configura la conexión a la base de datos creando un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=subida_archivos
DB_PORT=3306
```

Luego, crea la base de datos y la tabla correspondiente:

```sql
CREATE DATABASE subida_archivos;

USE subida_archivos;

CREATE TABLE file_model (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Uso

Para iniciar el servidor, ejecuta:

```sh
node server.js
```

El servidor se ejecutará en `http://localhost:3000/` y estará listo para recibir solicitudes.

## Endpoints

- **`POST /upload`** - Sube un archivo al servidor.
- **`GET /files`** - Lista todos los archivos almacenados.
- **`GET /files/:id`** - Recupera un archivo por su ID.
