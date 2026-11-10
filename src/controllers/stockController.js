const mongoose = require("mongoose");
const stockService = require("../services/stockService");

const idValido = (id) => mongoose.isObjectIdOrHexString(id);

const manejarError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({
            mensaje: error.message
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: "Ya existe stock de ese producto en ese depósito"
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

// Listar todos los stocks
const obtenerStocks = async (req, res) => {
    try {
        const stocks = await stockService.obtenerStocks();
        res.status(200).json(stocks);
    } catch (error) {
        manejarError(res, error);
    }
};

// Buscar stock por ID
const obtenerStockPorId = async (req, res) => {
    try {
        if (!idValido(req.params.id)) {
            return res.status(400).json({
                mensaje: "ID de stock inválido"
            });
        }

        const stock = await stockService.obtenerStockPorId(req.params.id);

        if (!stock) {
            return res.status(404).json({
                mensaje: "Stock no encontrado"
            });
        }

        res.status(200).json(stock);
    } catch (error) {
        manejarError(res, error);
    }
};

// Buscar stock por producto
const obtenerStockPorProducto = async (req, res) => {
    try {
        if (!idValido(req.params.productoId)) {
            return res.status(400).json({
                mensaje: "ID de producto inválido"
            });
        }

        const stocks = await stockService.obtenerStockPorProducto(
            req.params.productoId
        );

        res.status(200).json(stocks);
    } catch (error) {
        manejarError(res, error);
    }
};

// Buscar stock por depósito
const obtenerStockPorDeposito = async (req, res) => {
    try {
        if (!idValido(req.params.depositoId)) {
            return res.status(400).json({
                mensaje: "ID de depósito inválido"
            });
        }

        const stocks = await stockService.obtenerStockPorDeposito(
            req.params.depositoId
        );

        res.status(200).json(stocks);
    } catch (error) {
        manejarError(res, error);
    }
};

// Crear stock
const crearStock = async (req, res) => {
    try {
        const { producto, deposito, cantidad, stockMinimo } = req.body;

        const stock = await stockService.crearStock({
            producto,
            deposito,
            cantidad,
            stockMinimo
        });

        res.status(201).json(stock);
    } catch (error) {
        manejarError(res, error);
    }
};

// Actualizar stock
const actualizarStock = async (req, res) => {
    try {
        if (!idValido(req.params.id)) {
            return res.status(400).json({
                mensaje: "ID de stock inválido"
            });
        }

        const stock = await stockService.actualizarStock(
            req.params.id,
            req.body
        );

        if (!stock) {
            return res.status(404).json({
                mensaje: "Stock no encontrado"
            });
        }

        res.status(200).json(stock);
    } catch (error) {
        manejarError(res, error);
    }
};

// Eliminar stock
const eliminarStock = async (req, res) => {
    try {
        if (!idValido(req.params.id)) {
            return res.status(400).json({
                mensaje: "ID de stock inválido"
            });
        }

        const stock = await stockService.eliminarStock(req.params.id);

        if (!stock) {
            return res.status(404).json({
                mensaje: "Stock no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Registro de stock eliminado correctamente"
        });
    } catch (error) {
        manejarError(res, error);
    }
};

module.exports = {
    obtenerStocks,
    obtenerStockPorId,
    obtenerStockPorProducto,
    obtenerStockPorDeposito,
    crearStock,
    actualizarStock,
    eliminarStock
};