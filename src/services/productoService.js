const Producto = require("../models/Producto");
const Categoria = require("../models/Categoria");

// Obtener todos los productos
const obtenerProductos = async () => {
    return await Producto.find().populate(
        "categoria",
        "nombre detalle"
    );
};

// Obtener un producto por ID
const obtenerProductoPorId = async (id) => {
    return await Producto.findById(id).populate(
        "categoria",
        "nombre detalle"
    );
};

// Crear un producto
const crearProducto = async (datos) => {
    const categoria = await Categoria.findById(datos.categoria);

    if (!categoria) {
        const error = new Error("La categoría no existe");
        error.status = 404;
        throw error;
    }

    const producto = new Producto(datos);
    return await producto.save();
};

// Actualizar un producto
const actualizarProducto = async (id, datos) => {
    if (datos.categoria !== undefined) {
        const categoria = await Categoria.findById(datos.categoria);

        if (!categoria) {
            const error = new Error("La categoría no existe");
            error.status = 404;
            throw error;
        }
    }

    return await Producto.findByIdAndUpdate(
        id,
        datos,
        {
            new: true,
            runValidators: true
        }
    ).populate("categoria", "nombre detalle");
};

// Eliminar un producto
const eliminarProducto = async (id) => {
    return await Producto.findByIdAndDelete(id);
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};