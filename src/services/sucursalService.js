const Sucursal = require("../models/Sucursal");

const obtenerSucursales = async () => {
    return await Sucursal.find();
};

const obtenerSucursalPorId = async (id) => {
    return await Sucursal.findById(id);
};

const crearSucursal = async (datos) => {
    return await Sucursal.create(datos);
};

const actualizarSucursal = async (id, datos) => {
    return await Sucursal.findByIdAndUpdate(
        id,
        { $set: datos },
        {
            new: true,
            runValidators: true
        }
    );
};

const eliminarSucursal = async (id) => {
    return await Sucursal.findByIdAndDelete(id);
};

module.exports = {
    obtenerSucursales,
    obtenerSucursalPorId,
    crearSucursal,
    actualizarSucursal,
    eliminarSucursal
};