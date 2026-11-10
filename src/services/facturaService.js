const mongoose = require("mongoose");

const Factura = require("../models/Factura");
const ItemFactura = require("../models/ItemFactura");
const Producto = require("../models/Producto");
const Cliente = require("../models/Cliente");
const Vendedor = require("../models/Vendedor");
const Sucursal = require("../models/Sucursal");
const Deposito = require("../models/Deposito");
const Stock = require("../models/Stock");

// Crear errores con códigos HTTP
const crearError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error;
};

// Validar identificadores
const validarId = (id, entidad) => {
    if (!mongoose.isObjectIdOrHexString(id)) {
        throw crearError(`ID de ${entidad} inválido`, 400);
    }
};

// Redondear importes monetarios a dos decimales
const redondear = (numero) => {
    return Math.round((numero + Number.EPSILON) * 100) / 100;
};

// Obtener todas las facturas
const obtenerFacturas = async () => {
    return await Factura.find()
        .populate("cliente", "codigo razonSocial")
        .populate("vendedor", "codigo nombre apellido")
        .populate("sucursal", "codigo nombre");
};

// Obtener una factura con sus ítems
const obtenerFacturaPorId = async (id, usuario) => {
    validarId(id, "factura");

    const factura = await Factura.findById(id)
        .populate("cliente", "codigo razonSocial")
        .populate("vendedor", "codigo nombre apellido")
        .populate("sucursal", "codigo nombre");

    if (!factura) {
        throw crearError("Factura no encontrada", 404);
    }

    // Los clientes solo pueden consultar sus propias facturas
    if (usuario.rol === "CLIENTE") {
        if (
            !usuario.cliente ||
            factura.cliente._id.toString() !==
                usuario.cliente.toString()
        ) {
            throw crearError("Factura no encontrada", 404);
        }
    }

    const items = await ItemFactura.find({
        factura: id
    }).populate("producto", "codigo detalle marca");

    return {
        factura,
        items
    };
};

// Crear factura
const crearFactura = async (datos) => {
    const {
        numero,
        tipo,
        sucursal,
        cliente,
        vendedor,
        deposito,
        medioPago,
        descuento = 0,
        totalImpuestos = 0,
        items
    } = datos;

    // Validaciones generales
    if (!numero || !tipo || !medioPago) {
        throw crearError(
            "Número, tipo y medio de pago son obligatorios",
            400
        );
    }

    if (!["A", "B", "C"].includes(tipo)) {
        throw crearError("Tipo de factura inválido", 400);
    }

    validarId(sucursal, "sucursal");
    validarId(cliente, "cliente");
    validarId(vendedor, "vendedor");
    validarId(deposito, "depósito");

    if (!Array.isArray(items) || items.length === 0) {
        throw crearError(
            "La factura debe contener al menos un producto",
            400
        );
    }

    if (
        typeof descuento !== "number" ||
        !Number.isFinite(descuento) ||
        descuento < 0 ||
        typeof totalImpuestos !== "number" ||
        !Number.isFinite(totalImpuestos) ||
        totalImpuestos < 0
    ) {
        throw crearError(
            "Descuento e impuestos deben ser números no negativos",
            400
        );
    }

    if (
        !Number.isInteger(descuento * 100) ||
        !Number.isInteger(totalImpuestos * 100)
    ) {
        throw crearError(
            "Descuento e impuestos deben tener como máximo dos decimales",
            400
        );
    }

    // Validar ítems antes de abrir la transacción
    const productosRepetidos = new Set();

    for (const item of items) {
        if (!item || typeof item !== "object") {
            throw crearError("Ítem inválido", 400);
        }

        validarId(item.producto, "producto");

        if (
            !Number.isInteger(item.cantidad) ||
            item.cantidad <= 0
        ) {
            throw crearError(
                "La cantidad debe ser un entero mayor que cero",
                400
            );
        }

        const productoId = item.producto.toString();

        if (productosRepetidos.has(productoId)) {
            throw crearError(
                "No se puede repetir un producto en la misma factura",
                400
            );
        }

        productosRepetidos.add(productoId);
    }

    // Iniciar transacción
    const session = await mongoose.startSession();

    try {
        const resultado = await session.withTransaction(async () => {

            // Validar entidades relacionadas
            const [
                clienteExiste,
                vendedorExiste,
                sucursalExiste,
                depositoExiste
            ] = await Promise.all([
                Cliente.findById(cliente).session(session),
                Vendedor.findById(vendedor).session(session),
                Sucursal.findById(sucursal).session(session),
                Deposito.findById(deposito).session(session)
            ]);

            if (!clienteExiste) {
                throw crearError("Cliente no encontrado", 404);
            }

            if (!clienteExiste.estado) {
                throw crearError("El cliente está inactivo", 409);
            }

            if (!vendedorExiste) {
                throw crearError("Vendedor no encontrado", 404);
            }

            if (!sucursalExiste) {
                throw crearError("Sucursal no encontrada", 404);
            }

            if (!depositoExiste) {
                throw crearError("Depósito no encontrado", 404);
            }

            const itemsPreparados = [];
            let subtotalCentavos = 0;

            // Validar productos y preparar los ítems
            for (const item of items) {
                const producto = await Producto.findById(
                    item.producto
                ).session(session);

                if (!producto) {
                    throw crearError(
                        "Producto no encontrado",
                        404
                    );
                }

                if (!producto.estado) {
                    throw crearError(
                        `El producto ${producto.codigo} está inactivo`,
                        409
                    );
                }

                if (
                    typeof producto.precio !== "number" ||
                    !Number.isFinite(producto.precio) ||
                    producto.precio < 0
                ) {
                    throw crearError(
                        "El producto tiene un precio inválido",
                        400
                    );
                }

                const precioCentavos = Math.round(
                    producto.precio * 100
                );

                if (
                    Math.abs(
                        producto.precio * 100 - precioCentavos
                    ) > 0.000001
                ) {
                    throw crearError(
                        "El precio debe tener como máximo dos decimales",
                        400
                    );
                }

                subtotalCentavos +=
                    precioCentavos * item.cantidad;

                if (!Number.isSafeInteger(subtotalCentavos)) {
                    throw crearError(
                        "El importe de la factura es demasiado grande",
                        400
                    );
                }

                itemsPreparados.push({
                    producto: producto._id,
                    cantidad: item.cantidad,
                    precio: precioCentavos / 100
                });
            }

            const descuentoCentavos = Math.round(
                descuento * 100
            );

            const impuestosCentavos = Math.round(
                totalImpuestos * 100
            );

            if (descuentoCentavos > subtotalCentavos) {
                throw crearError(
                    "El descuento no puede superar el subtotal",
                    400
                );
            }

            const subtotal = subtotalCentavos / 100;

            const total = (
                subtotalCentavos -
                descuentoCentavos +
                impuestosCentavos
            ) / 100;

            // Descontar stock de forma condicional
            for (const item of itemsPreparados) {
                const stockActualizado = await Stock.findOneAndUpdate(
                    {
                        producto: item.producto,
                        deposito,
                        cantidad: { $gte: item.cantidad }
                    },
                    {
                        $inc: {
                            cantidad: -item.cantidad
                        }
                    },
                    {
                        new: true,
                        session,
                        runValidators: true
                    }
                );

                if (!stockActualizado) {
                    throw crearError(
                        "Stock insuficiente o inexistente para uno de los productos",
                        409
                    );
                }
            }

            // Crear factura
            const facturas = await Factura.create(
                [{
                    numero,
                    tipo,
                    sucursal,
                    cliente,
                    vendedor,
                    medioPago,
                    subtotal,
                    descuento: descuentoCentavos / 100,
                    totalImpuestos: impuestosCentavos / 100,
                    total,
                    estado: "EMITIDA"
                }],
                { session }
            );

            const factura = facturas[0];

            // Crear ítems
            const itemsGuardados = await ItemFactura.create(
                itemsPreparados.map(item => ({
                    ...item,
                    factura: factura._id
                })),
                { session }
            );

            return {
                factura,
                items: itemsGuardados
            };
        });

        return resultado;

    } finally {
        await session.endSession();
    }
};

const obtenerFacturasPorCliente = async (clienteId) => {
    return await Factura.find({cliente: clienteId})
    .populate("cliente", "codigo razonSocial")
    .populate("vendedor", "codigo nombre apellido")
    .populate("sucursal", "codigo nombre");
};


module.exports = {
    obtenerFacturas,
    obtenerFacturasPorCliente,
    obtenerFacturaPorId,
    crearFactura
};