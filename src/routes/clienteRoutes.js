const express = require("express");
const router = express.Router();

const controller = require("../controllers/clienteController");
const verificarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/rolMiddleware");

router.use(verificarToken);
router.use(autorizarRoles("ADMIN", "VENDEDOR"));

router.get("/", controller.obtenerClientes);
router.get("/:id", controller.obtenerClientePorId);

router.post("/", autorizarRoles("ADMIN"), controller.crearCliente);
router.put("/:id", autorizarRoles("ADMIN"), controller.actualizarCliente);
router.delete("/:id", autorizarRoles("ADMIN"), controller.eliminarCliente);

module.exports = router;