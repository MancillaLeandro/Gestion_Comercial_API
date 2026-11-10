require("dotenv").config();

const mongoose = require("mongoose");
const dns = require("node:dns");

const Usuario = require("../src/models/Usuario");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const crearAdmin = async () => {
    try {
        const [nombre, email, password] = process.argv.slice(2);

        if (!nombre || !email || !password) {
            throw new Error(
                'Uso: node scripts/crearAdmin.js "Nombre" "email"'
                + ' (la contraseña se solicita de forma segura)'
            );
        }

        if (password.length < 8) {
            throw new Error(
                "La contraseña debe tener al menos 8 caracteres"
            );
        }

        await mongoose.connect(process.env.MONGODB_URI);

        const existe = await Usuario.findOne({
            email: email.trim().toLowerCase()
        });

        if (existe) {
            throw new Error("Ya existe un usuario con ese email");
        }

        const admin = await Usuario.create({
            nombre,
            email,
            password,
            rol: "ADMIN",
            activo: true
        });

        console.log("Administrador creado correctamente");
        console.log("ID:", admin._id.toString());
        console.log("Email:", admin.email);

    } catch (error) {
        console.error("Error:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

crearAdmin();