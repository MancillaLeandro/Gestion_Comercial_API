const categoriaService = require("../services/categoriaService");
const mongoose = require("mongoose");

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.obtenerCategorias();

        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las categorías"
        });
    }
};

// Obtener una categoría por ID
const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                mensaje: "ID de categoría inválido"
            });
        }

        const categoria = await categoriaService.obtenerCategoriaPorId(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener la categoría"
        });
    }
};

// Crear una categoría
const crearCategoria = async (req, res) => {
    try {
        const { nombre, detalle } = req.body;

        const categoria = await categoriaService.crearCategoria({
            nombre,
            detalle
        });

        res.status(201).json(categoria);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                mensaje: "Ya existe una categoría con ese nombre"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        res.status(500).json({
            mensaje: "Error al crear la categoría"
        });
    }
};

// Actualizar una categoría
const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                mensaje: "ID de categoría inválido"
            });
        }

        const { nombre, detalle } = req.body;

        const datos = {};

        if (nombre !== undefined) datos.nombre = nombre;
        if (detalle !== undefined) datos.detalle = detalle;

        const categoria = await categoriaService.actualizarCategoria(
            id,
            datos
        );

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.status(200).json(categoria);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                mensaje: "Ya existe una categoría con ese nombre"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        res.status(500).json({
            mensaje: "Error al actualizar la categoría"
        });
    }
};

// Eliminar una categoría
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                mensaje: "ID de categoría inválido"
            });
        }

        const categoria = await categoriaService.eliminarCategoria(id);

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Categoría eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la categoría"
        });
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};