const mongoose = require("mongoose");
const vendedorService = require("../services/vendedorService");

const idValido = (id) => mongoose.isObjectIdOrHexString(id);

// Manejo de errores
const manejarError = (res, error) => {
    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: "Ya existe un vendedor con ese código"
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

    console.error(error);

    return res.status(500).json({
        mensaje: "Error interno del servidor"
    });
};

// Obtener todos los vendedores
const obtenerVendedores = async (req, res) => {
    try {
        const vendedores = await vendedorService.obtenerVendedores();

        res.status(200).json(vendedores);
    } catch (error) {
        manejarError(res, error);
    }
};

// Obtener vendedor por ID
const obtenerVendedorPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de vendedor inválido"
            });
        }

        const vendedor = await vendedorService.obtenerVendedorPorId(id);

        if (!vendedor) {
            return res.status(404).json({
                mensaje: "Vendedor no encontrado"
            });
        }

        res.status(200).json(vendedor);
    } catch (error) {
        manejarError(res, error);
    }
};

// Crear vendedor
const crearVendedor = async (req, res) => {
    try {
        const {
            codigo,
            nombre,
            apellido,
            telefono
        } = req.body;

        const vendedor = await vendedorService.crearVendedor({
            codigo,
            nombre,
            apellido,
            telefono
        });

        res.status(201).json(vendedor);
    } catch (error) {
        manejarError(res, error);
    }
};

// Actualizar vendedor
const actualizarVendedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de vendedor inválido"
            });
        }

        const camposPermitidos = [
            "codigo",
            "nombre",
            "apellido",
            "telefono"
        ];

        const datos = {};

        for (const campo of camposPermitidos) {
            if (req.body[campo] !== undefined) {
                datos[campo] = req.body[campo];
            }
        }

        const vendedor = await vendedorService.actualizarVendedor(
            id,
            datos
        );

        if (!vendedor) {
            return res.status(404).json({
                mensaje: "Vendedor no encontrado"
            });
        }

        res.status(200).json(vendedor);
    } catch (error) {
        manejarError(res, error);
    }
};

// Eliminar vendedor
const eliminarVendedor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de vendedor inválido"
            });
        }

        const vendedor = await vendedorService.eliminarVendedor(id);

        if (!vendedor) {
            return res.status(404).json({
                mensaje: "Vendedor no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Vendedor eliminado correctamente"
        });
    } catch (error) {
        manejarError(res, error);
    }
};

module.exports = {
    obtenerVendedores,
    obtenerVendedorPorId,
    crearVendedor,
    actualizarVendedor,
    eliminarVendedor
};