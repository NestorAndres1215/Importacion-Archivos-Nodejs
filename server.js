require('dotenv').config();
const app = require('./app');
const MENSAJES = require('./util/mensajes');
const { conectarBD } = require('./db/database');

const PORT = process.env.PORT || 3000;

(async function iniciarServidor() {
  try {
    // Conectar a la base de datos antes de iniciar el servidor
    await conectarBD();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 ${MENSAJES.SERVIDOR_CORRIENDO} → http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(`❌ ${MENSAJES.ERROR_INICIAR_SERVIDOR}:`, error.message);
    process.exit(1); // Salir del proceso si falla la conexión
  }
})();
