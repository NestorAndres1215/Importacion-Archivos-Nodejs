# Proyecto de Subida de Archivos con Node.js y MySQL

Este proyecto proporciona una solución completa para la **subida**, **almacenamiento** y **recuperación** de archivos utilizando **Node.js**, **Express**, **EJS** y **MySQL**. Permite a los usuarios subir archivos a un servidor, almacenarlos en una base de datos y recuperarlos según sea necesario. Además, cuenta con un diseño moderno utilizando **Bootstrap** y **FontAwesome**.

## Características

- **Subida de Archivos**: Permite a los usuarios cargar archivos a través de una interfaz sencilla con validaciones.
- **Almacenamiento Seguro**: Los archivos se guardan tanto en el sistema de archivos como en una base de datos MySQL, asegurando accesibilidad y persistencia.
- **Recuperación de Archivos**: Los archivos pueden ser fácilmente recuperados y descargados usando su ID.
- **Listar Archivos**: Proporciona una lista de todos los archivos almacenados en el sistema con opciones de descarga.
- **Gestión de Tipos de Archivos**: Permite restringir y validar los tipos de archivos permitidos para subir.
- **Manejo de Errores con SweetAlert2**: Implementa alertas visuales para mejorar la experiencia del usuario.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución para JavaScript en el servidor.
- **Express.js** - Framework ligero para construir aplicaciones web y APIs.
- **Multer** - Middleware para la gestión de archivos en Node.js.
- **MySQL** - Sistema de gestión de bases de datos relacional.
- **Sequelize** - ORM para interactuar con la base de datos MySQL.
- **EJS** - Motor de plantillas para generar vistas dinámicas.
- **Bootstrap** - Framework CSS para mejorar el diseño.
- **FontAwesome** - Iconos para mejorar la interfaz visual.
- **SweetAlert2** - Notificaciones y alertas personalizadas.

## Requisitos

- Tener instalado **Node.js** y **npm**.
- Tener un servidor MySQL en ejecución.

## Instalación

Clona el repositorio y ejecuta el siguiente comando para instalar las dependencias necesarias:

```sh
npm install express multer mysql2 sequelize dotenv ejs sweetalert2
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

- **`GET /`** - Página principal con formulario para subir archivos.
- **`POST /upload`** - Sube un archivo al servidor.
- **`GET /files`** - Lista todos los archivos almacenados.
- **`GET /files/:id`** - Recupera un archivo por su ID.



## Diseño con Bootstrap y FontAwesome

Se ha utilizado **Bootstrap** para mejorar la apariencia del formulario y la tabla de archivos. Además, **FontAwesome** se usa para agregar iconos en los botones de acción.



##  Pagina Principal
![image](https://github.com/user-attachments/assets/c0b70070-d485-4349-8565-c718be0ce770)

## Apartado de Subir Archivo
![image](https://github.com/user-attachments/assets/794eedd6-9e32-44f3-9b8b-f00eb328a249)
## Apartado de Listado Archivo
![image](https://github.com/user-attachments/assets/9c3c8eb0-6366-4e41-96e7-e1183ffe0753)


