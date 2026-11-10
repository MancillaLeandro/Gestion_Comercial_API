const mongoose = require("mongoose");

const depositoSchema = new mongoose.Schema(
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
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Deposito", depositoSchema);