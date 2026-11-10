const mongoose = require("mongoose");
const facturaService = require("../services/facturaService");

// Manejo centralizado de errores
const manejarError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({
            mensaje: error.message
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: "Ya existe una factura con ese número, tipo y sucursal"
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

    console.error("Error en facturación:", error);

    return res.status(500).json({
        mensaje: "Error interno del servidor"
    });
};

// Obtener todas las facturas
const obtenerFacturas = async (req, res) => {
    try {
        const facturas = await facturaService.obtenerFacturas();

        return res.status(200).json(facturas);
    } catch (error) {
        return manejarError(res, error);
    }
};

// Obtener una factura por ID, incluyendo sus ítems
const obtenerFacturaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isObjectIdOrHexString(id)) {
            return res.status(400).json({
                mensaje: "ID de factura inválido"
            });
        }

        const resultado = await facturaService.obtenerFacturaPorId(id,req.usuario);

        return res.status(200).json(resultado);
    } catch (error) {
        return manejarError(res, error);
    }
};

// Crear una factura
const crearFactura = async (req, res) => {
    try {
        const resultado = await facturaService.crearFactura(req.body);

        return res.status(201).json({
            mensaje: "Factura creada correctamente",
            ...resultado
        });
    } catch (error) {
        return manejarError(res, error);
    }
};

const obtenerMisFacturas = async (req, res) => {
    try {
        if (!req.usuario.cliente) {
            return res.status(403).json({
                mensaje: "El usuario no tiene un cliente asociado"
            });
        }

        const facturas =
            await facturaService.obtenerFacturasPorCliente(
                req.usuario.cliente
            );

        return res.status(200).json(facturas);
    } catch (error) {
        return manejarError(res, error);
    }
};

module.exports = {
    obtenerFacturas,
    obtenerMisFacturas,
    obtenerFacturaPorId,
    crearFactura
};