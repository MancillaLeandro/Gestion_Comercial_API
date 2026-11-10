const authService = require("../services/authService");

const manejarError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({
            mensaje: error.message
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: "El usuario ya existe"
        });
    }

    if (
        error.name === "ValidationError" ||
        error.name === "CastError"
    ) {
        return res.status(400).json({
            mensaje: error.message
        });
    }

    console.error("Error de autenticación:", error);

    return res.status(500).json({
        mensaje: "Error interno del servidor"
    });
};

// Registrar usuario
const registrarUsuario = async (req, res) => {
    try {
        const usuario = await authService.registrarUsuario(
            req.body
        );

        return res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario
        });
    } catch (error) {
        return manejarError(res, error);
    }
};

// Iniciar sesión
const iniciarSesion = async (req, res) => {
    try {
        const resultado = await authService.iniciarSesion(
            req.body
        );

        return res.status(200).json(resultado);
    } catch (error) {
        return manejarError(res, error);
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};