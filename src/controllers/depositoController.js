const depositoService = require("../services/depositoService");
const mongoose = require("mongoose");

const idValido = (id) => mongoose.isObjectIdOrHexString(id);

const manejarError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({
            mensaje: error.message
        });
    }

    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: "Ya existe un depósito con ese código"
        });
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({
            mensaje: error.message
        });
    }

    return res.status(500).json({
        mensaje: "Error interno del servidor"
    });
};

const obtenerDepositos = async (req, res) => {
    try {
        const depositos = await depositoService.obtenerDepositos();
        res.status(200).json(depositos);
    } catch (error) {
        manejarError(res, error);
    }
};

const obtenerDepositoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de depósito inválido"
            });
        }

        const deposito = await depositoService.obtenerDepositoPorId(id);

        if (!deposito) {
            return res.status(404).json({
                mensaje: "Depósito no encontrado"
            });
        }

        res.status(200).json(deposito);
    } catch (error) {
        manejarError(res, error);
    }
};

const crearDeposito = async (req, res) => {
    try {
        const { codigo, nombre, direccion } = req.body;

        const deposito = await depositoService.crearDeposito({
            codigo,
            nombre,
            direccion
        });

        res.status(201).json(deposito);
    } catch (error) {
        manejarError(res, error);
    }
};

const actualizarDeposito = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de depósito inválido"
            });
        }

        const datos = {};

        for (const campo of ["codigo", "nombre", "direccion"]) {
            if (req.body[campo] !== undefined) {
                datos[campo] = req.body[campo];
            }
        }

        const deposito = await depositoService.actualizarDeposito(
            id,
            datos
        );

        if (!deposito) {
            return res.status(404).json({
                mensaje: "Depósito no encontrado"
            });
        }

        res.status(200).json(deposito);
    } catch (error) {
        manejarError(res, error);
    }
};

const eliminarDeposito = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de depósito inválido"
            });
        }

        const deposito = await depositoService.eliminarDeposito(id);

        if (!deposito) {
            return res.status(404).json({
                mensaje: "Depósito no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Depósito eliminado correctamente"
        });
    } catch (error) {
        manejarError(res, error);
    }
};

module.exports = {
    obtenerDepositos,
    obtenerDepositoPorId,
    crearDeposito,
    actualizarDeposito,
    eliminarDeposito
};