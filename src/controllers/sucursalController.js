const mongoose = require("mongoose");
const sucursalService = require("../services/sucursalService");

const idValido = (id) => mongoose.isObjectIdOrHexString(id);

const manejarError = (res, error) => {
    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: "Ya existe una sucursal con ese código"
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

// Obtener todas las sucursales
const obtenerSucursales = async (req, res) => {
    try {
        const sucursales = await sucursalService.obtenerSucursales();
        res.status(200).json(sucursales);
    } catch (error) {
        manejarError(res, error);
    }
};

// Obtener sucursal por ID
const obtenerSucursalPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de sucursal inválido"
            });
        }

        const sucursal = await sucursalService.obtenerSucursalPorId(id);

        if (!sucursal) {
            return res.status(404).json({
                mensaje: "Sucursal no encontrada"
            });
        }

        res.status(200).json(sucursal);
    } catch (error) {
        manejarError(res, error);
    }
};

// Crear sucursal
const crearSucursal = async (req, res) => {
    try {
        const { codigo, nombre, direccion, telefono } = req.body;

        const sucursal = await sucursalService.crearSucursal({
            codigo,
            nombre,
            direccion,
            telefono
        });

        res.status(201).json(sucursal);
    } catch (error) {
        manejarError(res, error);
    }
};

// Actualizar sucursal
const actualizarSucursal = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de sucursal inválido"
            });
        }

        const camposPermitidos = [
            "codigo",
            "nombre",
            "direccion",
            "telefono"
        ];

        const datos = {};

        for (const campo of camposPermitidos) {
            if (req.body[campo] !== undefined) {
                datos[campo] = req.body[campo];
            }
        }

        const sucursal = await sucursalService.actualizarSucursal(
            id,
            datos
        );

        if (!sucursal) {
            return res.status(404).json({
                mensaje: "Sucursal no encontrada"
            });
        }

        res.status(200).json(sucursal);
    } catch (error) {
        manejarError(res, error);
    }
};

// Eliminar sucursal
const eliminarSucursal = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de sucursal inválido"
            });
        }

        const sucursal = await sucursalService.eliminarSucursal(id);

        if (!sucursal) {
            return res.status(404).json({
                mensaje: "Sucursal no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Sucursal eliminada correctamente"
        });
    } catch (error) {
        manejarError(res, error);
    }
};

module.exports = {
    obtenerSucursales,
    obtenerSucursalPorId,
    crearSucursal,
    actualizarSucursal,
    eliminarSucursal
};