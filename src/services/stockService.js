const mongoose = require("mongoose");

const Stock = require("../models/Stock");
const Producto = require("../models/Producto");
const Deposito = require("../models/Deposito");

const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

// Consultar todos los registros de stock
const obtenerStocks = async () => {
    return await Stock.find()
        .populate("producto", "codigo detalle marca")
        .populate("deposito", "codigo nombre direccion");
};

// Consultar stock por ID
const obtenerStockPorId = async (id) => {
    return await Stock.findById(id)
        .populate("producto", "codigo detalle marca")
        .populate("deposito", "codigo nombre direccion");
};

// Consultar stock de un producto
const obtenerStockPorProducto = async (productoId) => {
    return await Stock.find({ producto: productoId })
        .populate("producto", "codigo detalle marca")
        .populate("deposito", "codigo nombre direccion");
};

// Consultar stock de un depósito
const obtenerStockPorDeposito = async (depositoId) => {
    return await Stock.find({ deposito: depositoId })
        .populate("producto", "codigo detalle marca")
        .populate("deposito", "codigo nombre direccion");
};

// Registrar stock inicial
const crearStock = async (datos) => {
    const { producto, deposito, cantidad, stockMinimo } = datos;

    if (
        !mongoose.isObjectIdOrHexString(producto) ||
        !mongoose.isObjectIdOrHexString(deposito)
    ) {
        throw crearError("ID de producto o depósito inválido", 400);
    }

    const [productoExiste, depositoExiste] = await Promise.all([
        Producto.exists({ _id: producto }),
        Deposito.exists({ _id: deposito })
    ]);

    if (!productoExiste) {
        throw crearError("El producto no existe", 404);
    }

    if (!depositoExiste) {
        throw crearError("El depósito no existe", 404);
    }

    return await Stock.create({
        producto,
        deposito,
        cantidad,
        stockMinimo
    });
};

// Actualizar stock existente
const actualizarStock = async (id, datos) => {
    const permitidos = ["cantidad", "stockMinimo"];
    const cambios = {};

    for (const campo of permitidos) {
        if (datos[campo] !== undefined) {
            cambios[campo] = datos[campo];
        }
    }

    return await Stock.findByIdAndUpdate(
        id,
        { $set: cambios },
        {
            new: true,
            runValidators: true
        }
    )
        .populate("producto", "codigo detalle marca")
        .populate("deposito", "codigo nombre direccion");
};

// Eliminar un registro de stock
const eliminarStock = async (id) => {
    return await Stock.findByIdAndDelete(id);
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