const fs = require('fs');
const path = require('path');
const { query } = require('../db/database');
const MENSAJES = require('../util/mensajes');

const uploadDir = path.join(__dirname, '../../uploads');

// ✅ Crear carpeta uploads si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// RENDER VISTAS
const renderHome = (_, res) => res.render('index');
const renderUpload = (_, res) => res.render('upload');


// ✅ SUBIR ARCHIVO
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).render('upload', { mensaje: MENSAJES.ARCHIVO_NO_ENVIADO });
        }

        const { originalname, mimetype, buffer } = req.file;
        const filePath = path.join(uploadDir, originalname);

        // Guardar archivo en disco
        fs.writeFileSync(filePath, buffer);

        // Guardar en BD
        await query(
            'INSERT INTO file_model (name, type, data) VALUES (?, ?, ?)',
            [originalname, mimetype, buffer]
        );

        return res.redirect("/files");

    } catch (error) {
        console.error(error);
        return res.status(500).render('upload', { mensaje: MENSAJES.ERROR_SUBIDA });
    }
};


// ✅ LISTAR TODOS LOS ARCHIVOS
const listFiles = async (_, res) => {
    try {
        const [files] = await query('SELECT id, name, type FROM file_model ORDER BY id DESC');

        res.render('files', {
            files,
            mensaje: files.length === 0 ? MENSAJES.SIN_ARCHIVOS : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('files', { files: [], mensaje: MENSAJES.ERROR_RECUPERAR_ARCHIVOS });
    }
};


// ✅ DESCARGAR ARCHIVO POR ID
const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;

        const [[file]] = await query(
            'SELECT name, type, data FROM file_model WHERE id = ?',
            [id]
        );

        if (!file) return res.status(404).send(MENSAJES.ARCHIVO_NO_ENCONTRADO);

        res.set({
            'Content-Type': file.type,
            'Content-Disposition': `attachment; filename="${file.name}"`
        });

        res.send(file.data);

    } catch (error) {
        console.error(error);
        res.status(500).send(MENSAJES.ERROR_DESCARGA);
    }
};


// ✅ BUSCAR POR ID (JSON)
const getFileById = async (req, res) => {
    try {
        const { id } = req.params;

        const [[file]] = await query(
            'SELECT id, name, type FROM file_model WHERE id = ?',
            [id]
        );

        if (!file) return res.status(404).json({ mensaje: MENSAJES.ARCHIVO_NO_ENCONTRADO });

        res.json(file);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: MENSAJES.ERROR_RECUPERAR_ARCHIVOS });
    }
};


// ✅ BUSCAR POR NOMBRE
const searchFiles = async (req, res) => {
    try {
        const { nombre = "" } = req.query;

        const [files] = await query(
            'SELECT id, name, type FROM file_model WHERE name LIKE ? ORDER BY id DESC',
            [`%${nombre}%`]
        );

        res.render('files', {
            files,
            mensaje: files.length === 0 ? MENSAJES.SIN_COINCIDENCIAS : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('files', { files: [], mensaje: MENSAJES.ERROR_RECUPERAR_ARCHIVOS });
    }
};


// ✅ BUSCAR POR TIPO / EXTENSIÓN
const searchFilesByType = async (req, res) => {
    try {
        const { tipo = "" } = req.query;

        const [files] = await query(
            `SELECT id, name, type
             FROM file_model 
             WHERE type LIKE ? OR name LIKE ? 
             ORDER BY id DESC`,
            [`%${tipo}%`, `%${tipo}%`]
        );

        res.render('files', {
            files,
            mensaje: files.length === 0 ? MENSAJES.SIN_COINCIDENCIAS : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('files', { files: [], mensaje: MENSAJES.ERROR_RECUPERAR_ARCHIVOS });
    }
};
// 📌 Estadísticas por tipo de archivo
const getFileStats = async (req, res) => {
    try {
        // Total de archivos
        const [[{ total }]] = await query('SELECT COUNT(*) AS total FROM file_model');

        if (total === 0) {
            return res.render('stats', { stats: [], mensaje: MENSAJES.SIN_ARCHIVOS });
        }

        // Conteo por tipo (sacamos solo la parte final del mime)
        const [rows] = await query(`
            SELECT 
                SUBSTRING_INDEX(type, '/', -1) AS extension,
                COUNT(*) AS cantidad
            FROM file_model
            GROUP BY extension
            ORDER BY cantidad DESC;
        `);

        // Calculamos porcentajes
        const stats = rows.map(item => ({
            extension: item.extension,
            cantidad: item.cantidad,
            porcentaje: ((item.cantidad / total) * 100).toFixed(2) // 2 decimales
        }));

        res.render('stats', { stats, mensaje: null });

    } catch (error) {
        console.error(error);
        res.status(500).render('stats', { stats: [], mensaje: MENSAJES.ERROR_RECUPERAR_ARCHIVOS });
    }
};


module.exports = {
    renderHome,
    renderUpload,
    uploadFile,
    listFiles,
    downloadFile,
    getFileById,
    searchFiles,
    searchFilesByType,
    getFileStats // ✅ Aquí
};
