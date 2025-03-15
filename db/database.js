// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia por tu usuario de MySQL
    password: '12345', // Cambia por tu contraseña de MySQL
    database: 'subida_archivos', // Cambia por el nombre de tu base de datos
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = db;
