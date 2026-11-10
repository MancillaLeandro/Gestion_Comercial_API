const express = require("express");
const router = express.Router();

const facturaController = require("../controllers/facturaController");

const verificarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/rolMiddleware");

router.use(verificarToken);

// ADMIN y VENDEDOR pueden consultar todas las facturas
router.get(
    "/",
    autorizarRoles("ADMIN", "VENDEDOR"),
    facturaController.obtenerFacturas
);

// Los clientes consultan sus propias facturas
router.get(
    "/mis-facturas",
    autorizarRoles("CLIENTE"),
    facturaController.obtenerMisFacturas
);

// Consultar una factura específica
router.get(
    "/:id",
    autorizarRoles("ADMIN", "VENDEDOR", "CLIENTE"),
    facturaController.obtenerFacturaPorId
);

// Crear facturas
router.post(
    "/",
    autorizarRoles("ADMIN", "VENDEDOR"),
    facturaController.crearFactura
);

module.exports = router;