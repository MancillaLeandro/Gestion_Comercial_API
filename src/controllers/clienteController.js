const mongoose = require("mongoose");
const clienteService = require("../services/clienteService");

const idValido = (id) => mongoose.isObjectIdOrHexString(id);

const manejarError = (res, error) => {
    if (error.code === 11000) {
        return res.status(409).json({
            mensaje: "Ya existe un cliente con ese código o CUIL"
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

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
    try {
        const clientes = await clienteService.obtenerClientes();

        res.status(200).json(clientes);
    } catch (error) {
        manejarError(res, error);
    }
};

// Obtener cliente por ID
const obtenerClientePorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de cliente inválido"
            });
        }

        const cliente = await clienteService.obtenerClientePorId(id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.status(200).json(cliente);
    } catch (error) {
        manejarError(res, error);
    }
};

// Crear cliente
const crearCliente = async (req, res) => {
    try {
        const {
            codigo,
            razonSocial,
            domicilio,
            cuil,
            email,
            telefono,
            estado
        } = req.body;

        const cliente = await clienteService.crearCliente({
            codigo,
            razonSocial,
            domicilio,
            cuil,
            email,
            telefono,
            estado
        });

        res.status(201).json(cliente);
    } catch (error) {
        manejarError(res, error);
    }
};

// Actualizar cliente
const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de cliente inválido"
            });
        }

        const camposPermitidos = [
            "codigo",
            "razonSocial",
            "domicilio",
            "cuil",
            "email",
            "telefono",
            "estado"
        ];

        const datos = {};

        for (const campo of camposPermitidos) {
            if (req.body[campo] !== undefined) {
                datos[campo] = req.body[campo];
            }
        }

        const cliente = await clienteService.actualizarCliente(
            id,
            datos
        );

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.status(200).json(cliente);
    } catch (error) {
        manejarError(res, error);
    }
};

// Eliminar cliente
const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).json({
                mensaje: "ID de cliente inválido"
            });
        }

        const cliente = await clienteService.eliminarCliente(id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Cliente eliminado correctamente"
        });
    } catch (error) {
        manejarError(res, error);
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};