// server.js
require('dotenv').config();
const app = require('./app');
const MENSAJES  = require('./util/mensajes');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 ${MENSAJES.SERVIDOR_CORRIENDO} http://localhost:${PORT}`);
});
