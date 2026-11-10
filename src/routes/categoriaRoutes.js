const express = require("express");
const router = express.Router();

const controller = require("../controllers/categoriaController");
const verificarToken = require("../middlewares/authMiddleware");
const autorizarRoles = require("../middlewares/rolMiddleware");

router.use(verificarToken);

router.get("/", controller.obtenerCategorias);
router.get("/:id", controller.obtenerCategoriaPorId);

router.post("/", autorizarRoles("ADMIN"), controller.crearCategoria);
router.put("/:id", autorizarRoles("ADMIN"), controller.actualizarCategoria);
router.delete("/:id", autorizarRoles("ADMIN"), controller.eliminarCategoria);

module.exports = router;