const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");
const Cliente = require("../models/Cliente");
const Vendedor = require("../models/Vendedor");

// Crear errores personalizados
const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

// Generar token JWT
const generarToken = (usuario) => {
    if (!process.env.JWT_SECRET) {
        throw crearError(
            "JWT_SECRET no está configurado",
            500
        );
    }

    return jwt.sign(
        {
            id: usuario._id.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "8h"
        }
    );
};

// Preparar datos públicos del usuario
const obtenerDatosPublicos = (usuario) => {
    return {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        cliente: usuario.cliente,
        vendedor: usuario.vendedor,
        activo: usuario.activo
    };
};

// Registrar usuario
const registrarUsuario = async (datos) => {
    const {
        nombre,
        email,
        password,
        rol,
        cliente,
        vendedor
    } = datos;

    // Validar datos obligatorios
    if (
        typeof nombre !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !nombre.trim() ||
        !email.trim() ||
        password.length < 8
    ) {
        throw crearError(
            "Nombre, email y contraseña de al menos 8 caracteres son obligatorios",
            400
        );
    }

    // Validar rol
    const rolesPermitidos = ["ADMIN", "VENDEDOR", "CLIENTE"];

    if (!rolesPermitidos.includes(rol)) {
        throw crearError("Rol de usuario inválido", 400);
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuarioExistente = await Usuario.findOne({
        email: emailNormalizado
    });

    if (usuarioExistente) {
        throw crearError(
            "El correo electrónico ya está registrado",
            409
        );
    }

    let clienteAsociado = null;
    let vendedorAsociado = null;

    // Validaciones para CLIENTE
    if (rol === "CLIENTE") {
        if (!mongoose.isObjectIdOrHexString(cliente)) {
            throw crearError("ID de cliente inválido", 400);
        }

        if (vendedor != null) {
            throw crearError(
                "Un CLIENTE no puede tener un vendedor asociado",
                400
            );
        }

        const clienteExistente = await Cliente.findById(cliente);

        if (!clienteExistente) {
            throw crearError("Cliente no encontrado", 404);
        }

        if (!clienteExistente.estado) {
            throw crearError("El cliente está inactivo", 409);
        }

        const cuentaExistente = await Usuario.findOne({
            cliente: clienteExistente._id
        });

        if (cuentaExistente) {
            throw crearError(
                "El cliente ya tiene una cuenta",
                409
            );
        }

        clienteAsociado = clienteExistente._id;
    }

    // Validaciones para VENDEDOR
    if (rol === "VENDEDOR") {
        if (!mongoose.isObjectIdOrHexString(vendedor)) {
            throw crearError("ID de vendedor inválido", 400);
        }

        if (cliente != null) {
            throw crearError(
                "Un VENDEDOR no puede tener un cliente asociado",
                400
            );
        }

        const vendedorExistente = await Vendedor.findById(vendedor);

        if (!vendedorExistente) {
            throw crearError("Vendedor no encontrado", 404);
        }

        const cuentaExistente = await Usuario.findOne({
            vendedor: vendedorExistente._id
        });

        if (cuentaExistente) {
            throw crearError(
                "El vendedor ya tiene una cuenta",
                409
            );
        }

        vendedorAsociado = vendedorExistente._id;
    }

    // Validaciones para ADMIN
    if (rol === "ADMIN") {
        if (cliente != null) {
            throw crearError(
                "Un ADMIN no puede tener un cliente asociado",
                400
            );
        }

        if (vendedor != null) {
            if (!mongoose.isObjectIdOrHexString(vendedor)) {
                throw crearError("ID de vendedor inválido", 400);
            }

            const vendedorExistente = await Vendedor.findById(vendedor);

            if (!vendedorExistente) {
                throw crearError("Vendedor no encontrado", 404);
            }

            const cuentaExistente = await Usuario.findOne({
                vendedor: vendedorExistente._id
            });

            if (cuentaExistente) {
                throw crearError(
                    "El vendedor ya tiene una cuenta",
                    409
                );
            }

            vendedorAsociado = vendedorExistente._id;
        }
    }

    const usuario = await Usuario.create({
        nombre: nombre.trim(),
        email: emailNormalizado,
        password,
        rol,
        cliente: clienteAsociado,
        vendedor: vendedorAsociado,
        activo: true
    });

    return obtenerDatosPublicos(usuario);
};

// Iniciar sesión
const iniciarSesion = async (datos) => {
    const { email, password } = datos;

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        throw crearError(
            "Email y contraseña son obligatorios",
            400
        );
    }

    // select("+password") permite recuperar el hash,
    // ya que en el modelo usamos select: false.
    const usuario = await Usuario.findOne({
        email: email.trim().toLowerCase()
    }).select("+password");

    if (!usuario) {
        throw crearError(
            "Credenciales incorrectas",
            401
        );
    }

    const passwordCorrecta =
        await usuario.compararPassword(password);

    if (!passwordCorrecta) {
        throw crearError(
            "Credenciales incorrectas",
            401
        );
    }

    if (!usuario.activo) {
        throw crearError(
            "La cuenta está desactivada",
            403
        );
    }

    if (usuario.rol === "CLIENTE") {
        const cliente = await Cliente.findById(usuario.cliente);

        if (!cliente || !cliente.estado) {
            throw crearError(
                "El cliente asociado no está disponible",
                403
            );
        }
    }

    const token = generarToken(usuario);

    return {
        mensaje: "Inicio de sesión exitoso",
        token,
        usuario: obtenerDatosPublicos(usuario)
    };
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};