const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const verificarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/rolMiddleware");

// El login sigue siendo público
router.post("/login", authController.iniciarSesion);

// Solo ADMIN puede registrar usuarios
router.post(
    "/registro",
    verificarToken,
    autorizarRoles("ADMIN"),
    authController.registrarUsuario
);

module.exports = router;