const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        categoria: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categoria",
            required: true
        },

        detalle: {
            type: String,
            required: true,
            trim: true
        },

        precio: {
            type: Number,
            required: true,
            min: 0
        },

        estado: {
            type: Boolean,
            default: true
        },

        marca: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Producto", productoSchema);