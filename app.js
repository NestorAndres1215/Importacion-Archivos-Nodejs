const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./db/database'); 
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar almacenamiento de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Verificar si la carpeta 'uploads' existe, si no, crearla
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para subir archivos (Formulario)
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Ruta para manejar la subida de archivos
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ success: false, message: 'No se subió ningún archivo.' });
    }

    // Guardar el archivo en el sistema de archivos
    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    // Insertar en la base de datos
    const query = `INSERT INTO file_model (name, type, data) VALUES (?, ?, ?)`;

    db.query(query, [file.originalname, file.mimetype, file.buffer], (err, result) => {
        if (err) {
            console.error('Error al guardar en la base de datos:', err);
            return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos.' });
        }

        // Responder con JSON en lugar de redirigir directamente
        res.json({ success: true, message: 'Archivo subido exitosamente.' });
    });
});

// Ruta para listar archivos
app.get('/files', (req, res) => {
    const query = 'SELECT id, name, type FROM file_model';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al recuperar archivos:', err);
            return res.status(500).json({ error: 'Error al recuperar archivos.' });
        }

        res.render('files', { files: results });
    });
});

// Ruta para descargar archivos
app.get('/files/:id', (req, res) => {
    const fileId = req.params.id;
    const query = 'SELECT name, type, data FROM file_model WHERE id = ?';

    db.query(query, [fileId], (err, results) => {
        if (err) {
            console.error('Error al recuperar el archivo:', err);
            return res.status(500).json({ error: 'Error al recuperar el archivo.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Archivo no encontrado.' });
        }

        const file = results[0];
        res.setHeader('Content-Type', file.type);
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.send(file.data);
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
