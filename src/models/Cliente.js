const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        razonSocial: {
            type: String,
            required: true,
            trim: true
        },

        domicilio: {
            type: String,
            required: true,
            trim: true
        },

        cuil: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        telefono: {
            type: String,
            trim: true,
            default: ""
        },

        estado: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Cliente", clienteSchema);