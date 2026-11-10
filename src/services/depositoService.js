const Deposito = require("../models/Deposito");
const Stock = require("../models/Stock");

const obtenerDepositos = async () => {
    return await Deposito.find();
};

const obtenerDepositoPorId = async (id) => {
    return await Deposito.findById(id);
};

const crearDeposito = async (datos) => {
    return await Deposito.create(datos);
};

const actualizarDeposito = async (id, datos) => {
    return await Deposito.findByIdAndUpdate(
        id,
        datos,
        {
            new: true,
            runValidators: true
        }
    );
};

const eliminarDeposito = async (id) => {
    // Evitamos eliminar depósitos que tengan stock registrado
    const tieneStock = await Stock.exists({ deposito: id });

    if (tieneStock) {
        const error = new Error(
            "No se puede eliminar un depósito con stock asociado"
        );
        error.status = 409;
        throw error;
    }

    return await Deposito.findByIdAndDelete(id);
};

module.exports = {
    obtenerDepositos,
    obtenerDepositoPorId,
    crearDeposito,
    actualizarDeposito,
    eliminarDeposito
};