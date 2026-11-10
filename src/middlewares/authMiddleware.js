const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const verificarToken = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                mensaje: "Token de autenticación requerido"
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                mensaje: "Token inválido"
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET no está configurado");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"]
        });

        const usuario = await Usuario.findById(decoded.id)
            .select("-password");

        if (!usuario || !usuario.activo) {
            return res.status(401).json({
                mensaje: "Usuario inexistente o desactivado"
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                mensaje: "Token inválido o expirado"
            });
        }

        console.error(error);

        return res.status(500).json({
            mensaje: "Error interno del servidor"
        });
    }
};

module.exports = verificarToken;