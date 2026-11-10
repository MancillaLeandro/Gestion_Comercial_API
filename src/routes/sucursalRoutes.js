const express = require("express");
const router = express.Router();

const controller = require("../controllers/sucursalController");
const verificarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/rolMiddleware");

router.use(verificarToken);
router.use(autorizarRoles("ADMIN", "VENDEDOR"));

router.get("/", controller.obtenerSucursales);
router.get("/:id", controller.obtenerSucursalPorId);

router.post("/", autorizarRoles("ADMIN"), controller.crearSucursal);
router.put("/:id", autorizarRoles("ADMIN"), controller.actualizarSucursal);
router.delete("/:id", autorizarRoles("ADMIN"), controller.eliminarSucursal);

module.exports = router;