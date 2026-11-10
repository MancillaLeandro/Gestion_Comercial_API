const express = require("express");
const router = express.Router();

const productoController = require("../controllers/productoController");

const verificarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/rolMiddleware");

// Todas las operaciones requieren autenticación
router.use(verificarToken);

// Consultar productos: cualquier usuario autenticado
router.get("/", productoController.obtenerProductos);
router.get("/:id", productoController.obtenerProductoPorId);

// Modificar productos: solo administradores
router.post(
    "/",
    autorizarRoles("ADMIN"),
    productoController.crearProducto
);

router.put(
    "/:id",
    autorizarRoles("ADMIN"),
    productoController.actualizarProducto
);

router.delete(
    "/:id",
    autorizarRoles("ADMIN"),
    productoController.eliminarProducto
);

module.exports = router;