const fs = require('fs');
const path = require('path');
const db = require('../db/database');
const MENSAJES = require('../util/mensajes');

const uploadDir = path.join(__dirname, '../../uploads');

// Crear carpeta uploads si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// RENDER VISTAS
const renderHome = (req, res) => res.render('index');
const renderUpload = (req, res) => res.render('upload');

// SUBIR ARCHIVO
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).render('upload', { mensaje: MENSAJES.ARCHIVO_NO_ENVIADO });
        }

        const { originalname, mimetype, buffer } = req.file;
        const filePath = path.join(uploadDir, originalname);

        // Guardamos archivo físico
        fs.writeFileSync(filePath, buffer);

        // Guardamos datos en la BD
        await db.query(
            'INSERT INTO file_model (name, type, data) VALUES (?, ?, ?)',
            [originalname, mimetype, buffer]
        );

        return res.redirect("/files");

    } catch (error) {
        console.error(error);
        return res.status(500).render('upload', { mensaje: MENSAJES.ERROR_SUBIDA });
    }
};

// LISTAR ARCHIVOS
const listFiles = async (req, res) => {
    try {
        const [files] = await db.query('SELECT id, name, type FROM file_model ORDER BY id DESC');

        res.render('files', {
            files,
            mensaje: files.length === 0 ? MENSAJES.SIN_ARCHIVOS : null
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('files', { files: [], mensaje: MENSAJES.ERROR_RECUPERAR_ARCHIVOS });
    }
};

// DESCARGAR ARCHIVO
const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;

        const [[file]] = await db.query(
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
// ✅ LISTAR POR ID
const getFileById = async (req, res) => {
    try {
        const { id } = req.params;

        const [[file]] = await db.query(
            'SELECT id, name, type FROM file_model WHERE id = ?',
            [id]
        );

        if (!file) {
            return res.status(404).json({ mensaje: MENSAJES.ARCHIVO_NO_ENCONTRADO });
        }

        res.json(file);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: MENSAJES.ERROR_RECUPERAR_ARCHIVOS });
    }
};

// ✅ LISTAR POR NOMBRE (BÚSQUEDA LIKE)
const searchFiles = async (req, res) => {
    try {
        const { nombre } = req.query;

        const [files] = await db.query(
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
// LISTAR POR TIPO (BUSCAR POR MIME O EXTENSIÓN)
const searchFilesByType = async (req, res) => {
    try {
        const { tipo } = req.query;

        if (!tipo || tipo.trim() === "") {
            return res.redirect("/files");
        }

        const [files] = await db.query(
            `SELECT id, name, type 
             FROM file_model 
             WHERE type LIKE ? 
             OR name LIKE ? 
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

module.exports = {
    renderHome,
    renderUpload,
    uploadFile,
    searchFilesByType,
    listFiles,
    getFileById,    // ✅ Nuevo
    searchFiles,    // ✅ Nuevo
    downloadFile
};