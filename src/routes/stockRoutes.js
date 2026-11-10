const express = require("express");
const router = express.Router();

const controller = require("../controllers/stockController");
const verificarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/rolMiddleware");

router.use(verificarToken);
router.use(autorizarRoles("ADMIN", "VENDEDOR"));

router.get("/", controller.obtenerStocks);
router.get("/producto/:productoId", controller.obtenerStockPorProducto);
router.get("/deposito/:depositoId", controller.obtenerStockPorDeposito);
router.get("/:id", controller.obtenerStockPorId);

router.post("/", autorizarRoles("ADMIN"), controller.crearStock);
router.put("/:id", autorizarRoles("ADMIN"), controller.actualizarStock);
router.delete("/:id", autorizarRoles("ADMIN"), controller.eliminarStock);

module.exports = router;