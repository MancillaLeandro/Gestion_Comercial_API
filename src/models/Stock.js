const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
    {
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
            required: true
        },

        deposito: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deposito",
            required: true
        },

        cantidad: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        stockMinimo: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Evitar registros duplicados del mismo producto en un depósito
stockSchema.index(
    { producto: 1, deposito: 1 },
    { unique: true }
);

module.exports = mongoose.model("Stock", stockSchema);