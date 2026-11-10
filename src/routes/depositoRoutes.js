const express = require("express");
const router = express.Router();

const controller = require("../controllers/depositoController");
const verificarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/rolMiddleware");

router.use(verificarToken);
router.use(autorizarRoles("ADMIN", "VENDEDOR"));

router.get("/", controller.obtenerDepositos);
router.get("/:id", controller.obtenerDepositoPorId);

router.post("/", autorizarRoles("ADMIN"), controller.crearDeposito);
router.put("/:id", autorizarRoles("ADMIN"), controller.actualizarDeposito);
router.delete("/:id", autorizarRoles("ADMIN"), controller.eliminarDeposito);

module.exports = router;