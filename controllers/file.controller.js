// src/controllers/file.controller.js
const fs = require('fs');
const path = require('path');
const db = require('../db/database');
const MENSAJES = require('../util/mensajes');

const uploadDir = path.join(__dirname, '../../uploads');

// Crear carpeta uploads si no existe
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const renderHome = (req, res) => {
    res.render('index', { mensaje: null });
};

const renderUpload = (req, res) => {
    res.render('upload', { mensaje: null });
};

const uploadFile = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).render('upload', { mensaje: MENSAJES.ARCHIVO_NO_ENVIADO });
    }

    const filePath = path.join(uploadDir, file.originalname);
    try {
        fs.writeFileSync(filePath, file.buffer);

        const query = 'INSERT INTO file_model (name, type, data) VALUES (?, ?, ?)';
        db.query(query, [file.originalname, file.mimetype, file.buffer], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).render('upload', { mensaje: MENSAJES.ERROR_SUBIDA });
            }
            return res.redirect("/");
        });
    } catch (err) {
        console.error(err);
        res.status(500).render('upload', { mensaje: MENSAJES.ERROR_SUBIDA });
    }
};

const listFiles = (req, res) => {
    const query = 'SELECT id, name, type FROM file_model';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).render('files', { files: [], mensaje: MENSAJES.ERROR_RECUPERAR_ARCHIVOS });
        }
        res.render('files', { files: results, mensaje: null });
    });
};

const downloadFile = (req, res) => {
    const fileId = req.params.id;
    const query = 'SELECT name, type, data FROM file_model WHERE id = ?';
    db.query(query, [fileId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(MENSAJES.ERROR_SUBIDA);
        }
        if (results.length === 0) {
            return res.status(404).send(MENSAJES.ARCHIVO_NO_ENCONTRADO);
        }
        const file = results[0];
        res.setHeader('Content-Type', file.type);
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.send(file.data);
    });
};

module.exports = {
    renderHome,
    renderUpload,
    uploadFile,
    listFiles,
    downloadFile
};
