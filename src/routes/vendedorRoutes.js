const express = require("express");
const router = express.Router();

const controller = require("../controllers/vendedorController");
const verificarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/rolMiddleware");

router.use(verificarToken);
router.use(autorizarRoles("ADMIN"));

router.get("/", controller.obtenerVendedores);
router.get("/:id", controller.obtenerVendedorPorId);
router.post("/", controller.crearVendedor);
router.put("/:id", controller.actualizarVendedor);
router.delete("/:id", controller.eliminarVendedor);

module.exports = router;