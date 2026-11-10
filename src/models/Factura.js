const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema(
    {
        numero: {
            type: String,
            required: true,
            trim: true
        },

        tipo: {
            type: String,
            required: true,
            enum: ["A", "B", "C"]
        },

        sucursal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sucursal",
            required: true
        },

        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente",
            required: true
        },

        vendedor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendedor",
            required: true
        },

        fecha: {
            type: Date,
            default: Date.now
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        descuento: {
            type: Number,
            default: 0,
            min: 0
        },

        totalImpuestos: {
            type: Number,
            default: 0,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        medioPago: {
            type: String,
            required: true,
            trim: true
        },

        estado: {
            type: String,
            enum: ["EMITIDA", "ANULADA"],
            default: "EMITIDA"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Evita facturas duplicadas con el mismo
// número, tipo y sucursal.
facturaSchema.index(
    { numero: 1, tipo: 1, sucursal: 1 },
    { unique: true }
);

module.exports = mongoose.model("Factura", facturaSchema);