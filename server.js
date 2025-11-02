require('dotenv').config();
const app = require('./app');
const MENSAJES = require('./util/mensajes');
const { conectarBD } = require('./config/db'); // Importamos la conexión

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await conectarBD(); // ⬅️ Validamos conexión antes de iniciar el servidor

        app.listen(PORT, () => {
            console.log(`✅ ${MENSAJES.SERVIDOR_CORRIENDO} → http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error(`❌ ${MENSAJES.ERROR_INICIAR_SERVIDOR}:`, error.message);
        process.exit(1); // Detenemos la app si algo falla
    }
})();
