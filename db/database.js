// src/config/db.js
const mysql = require('mysql2');
const  MENSAJES  = require('../util/mensajes'); // Mensajes centralizados

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'subida_archivos',
});

db.connect((err) => {
    if (err) {
        console.error(`${MENSAJES.ERROR_DB}:`, err);
        return;
    }
    console.log(MENSAJES.DB_CONECTADA);
});

module.exports = db;
