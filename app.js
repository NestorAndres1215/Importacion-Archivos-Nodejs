const express = require('express');
const path = require('path');
const cors = require('cors');
const fileRoutes = require('./routes/file.routes');
const { PATHS, MENSAJES } = require('./util/constants');

const app = express();

// Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, PATHS.VIEWS));

// Archivos estáticos
app.use(express.static(path.join(__dirname, PATHS.CSS)));
app.use(express.static(path.join(__dirname, PATHS.UPLOADS)));
app.use(express.static(path.join(__dirname, PATHS.PUBLIC)));

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/', fileRoutes);

// Middleware 404
app.use((req, res) => {
  res.status(404).render('404', { mensaje: MENSAJES.ERROR_404 });
});

// Middleware errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { mensaje: MENSAJES.ERROR_500 });
});

module.exports = app;
