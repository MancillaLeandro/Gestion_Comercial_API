const Vendedor = require("../models/Vendedor");

// Obtener todos los vendedores
const obtenerVendedores = async () => {
    return await Vendedor.find();
};

// Obtener un vendedor por ID
const obtenerVendedorPorId = async (id) => {
    return await Vendedor.findById(id);
};

// Crear un vendedor
const crearVendedor = async (datos) => {
    return await Vendedor.create(datos);
};

// Actualizar un vendedor
const actualizarVendedor = async (id, datos) => {
    return await Vendedor.findByIdAndUpdate(
        id,
        { $set: datos },
        {
            new: true,
            runValidators: true
        }
    );
};

// Eliminar un vendedor
const eliminarVendedor = async (id) => {
    return await Vendedor.findByIdAndDelete(id);
};

module.exports = {
    obtenerVendedores,
    obtenerVendedorPorId,
    crearVendedor,
    actualizarVendedor,
    eliminarVendedor
};