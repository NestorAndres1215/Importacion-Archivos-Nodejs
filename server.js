require('dotenv').config();
const app = require('./app');
const MENSAJES = require('./util/mensajes');
const { conectarBD } = require('./db/database');

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await conectarBD(); // Conectar BD antes de iniciar server

        app.listen(PORT, () => {
            console.log(`🚀 ${MENSAJES.SERVIDOR_CORRIENDO} → http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error(`❌ ${MENSAJES.ERROR_INICIAR_SERVIDOR}:`, error.message);
        process.exit(1);
    }
})();
