// src/db/database.js
const mysql = require('mysql2/promise');
const MENSAJES = require('../util/mensajes');

let pool;

async function conectarBD() {
    try {
        pool = await mysql.createPool({
            host: process.env.DB_HOST ?? 'localhost',
            user: process.env.DB_USER ?? 'root',
            password: process.env.DB_PASSWORD ?? '12345',
            database: process.env.DB_NAME ?? 'subida_archivos',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log(`✅ ${MENSAJES.DB_CONECTADA}`);
        return pool;

    } catch (error) {
        console.error(`❌ ${MENSAJES.ERROR_DB}: ${error.message}`);
        throw error;
    }
}

// Esta función permite hacer consultas sin reconectar cada vez
function query(sql, params) {
    return pool.query(sql, params);
}

module.exports = {
    conectarBD,
    query
};
