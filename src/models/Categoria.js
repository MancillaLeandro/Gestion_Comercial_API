const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        detalle: {
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

module.exports = mongoose.model("Categoria", categoriaSchema);