const Categoria = require("../models/Categoria");

// Obtener todas las categorías
const obtenerCategorias = async () => {
    return await Categoria.find();
};

// Obtener una categoría por ID
const obtenerCategoriaPorId = async (id) => {
    return await Categoria.findById(id);
};

// Crear una categoría
const crearCategoria = async (datos) => {
    const categoria = new Categoria(datos);
    return await categoria.save();
};

// Actualizar una categoría
const actualizarCategoria = async (id, datos) => {
    return await Categoria.findByIdAndUpdate(
        id,
        datos,
        {
            new: true,
            runValidators: true
        }
    );
};

// Eliminar una categoría
const eliminarCategoria = async (id) => {
    return await Categoria.findByIdAndDelete(id);
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};