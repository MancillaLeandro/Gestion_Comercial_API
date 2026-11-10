const Cliente = require("../models/Cliente");

const obtenerClientes = async () => {
    return await Cliente.find();
};

const obtenerClientePorId = async (id) => {
    return await Cliente.findById(id);
};

const crearCliente = async (datos) => {
    return await Cliente.create(datos);
};

const actualizarCliente = async (id, datos) => {
    return await Cliente.findByIdAndUpdate(
        id,
        { $set: datos },
        {
            new: true,
            runValidators: true
        }
    );
};

const eliminarCliente = async (id) => {
    return await Cliente.findByIdAndDelete(id);
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};