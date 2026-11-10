const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const app = require("./app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Servidor ejecutandose en puerto ${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error.message);
        process.exit(1);
    }
};

startServer();
