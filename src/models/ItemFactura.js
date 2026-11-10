const mongoose = require("mongoose");

const itemFacturaSchema = new mongoose.Schema(
    {
        factura: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Factura",
            required: true
        },

        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
            required: true
        },

        cantidad: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "La cantidad debe ser un número entero"
            }
        },

        precio: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model(
    "ItemFactura",
    itemFacturaSchema
);