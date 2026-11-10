const mongoose = require("mongoose");

const sucursalSchema = new mongoose.Schema(
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
        direccion: {
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

module.exports = mongoose.model("Sucursal", sucursalSchema);