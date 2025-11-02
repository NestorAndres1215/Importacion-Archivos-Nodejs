// src/routes/file.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/file.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', fileController.renderHome);
router.get('/upload', fileController.renderUpload);
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/files', fileController.listFiles);
router.get('/files/:id', fileController.downloadFile);

module.exports = router;
