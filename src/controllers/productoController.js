const productoService = require("../services/productoService");
const mongoose = require("mongoose");

const idValido = (id) => mongoose.isObjectIdOrHexString(id);

// Obtener todos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await productoService.obtenerProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los productos"
        });
    }
};

// Obtener por ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de producto inválido"
            });
        }

        const producto = await productoService.obtenerProductoPorId(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el producto"
        });
    }
};

// Crear producto
const crearProducto = async (req, res) => {
    try {
        const {
            codigo,
            categoria,
            detalle,
            precio,
            estado,
            marca
        } = req.body;

        if (!idValido(categoria)) {
            return res.status(400).json({
                mensaje: "ID de categoría inválido"
            });
        }

        const producto = await productoService.crearProducto({
            codigo,
            categoria,
            detalle,
            precio,
            estado,
            marca
        });

        res.status(201).json(producto);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                mensaje: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                mensaje: "Ya existe un producto con ese código"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        res.status(500).json({
            mensaje: "Error al crear el producto"
        });
    }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de producto inválido"
            });
        }

        const datos = {};
        const campos = [
            "codigo",
            "categoria",
            "detalle",
            "precio",
            "estado",
            "marca"
        ];

        for (const campo of campos) {
            if (req.body[campo] !== undefined) {
                datos[campo] = req.body[campo];
            }
        }

        if (
            datos.categoria !== undefined &&
            !idValido(datos.categoria)
        ) {
            return res.status(400).json({
                mensaje: "ID de categoría inválido"
            });
        }

        const producto = await productoService.actualizarProducto(
            id,
            datos
        );

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json(producto);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                mensaje: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                mensaje: "Ya existe un producto con ese código"
            });
        }

        if (
            error.name === "ValidationError" ||
            error.name === "CastError"
        ) {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        res.status(500).json({
            mensaje: "Error al actualizar el producto"
        });
    }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de producto inválido"
            });
        }

        const producto = await productoService.eliminarProducto(id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Producto eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el producto"
        });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};