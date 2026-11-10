const mongoose = require("mongoose");

const vendedorSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        nombre: {
            type: String,
            required: true,
            trim: true
        },

        apellido: {
            type: String,
            required: true,
            trim: true
        },

        telefono: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Vendedor", vendedorSchema);