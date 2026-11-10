const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },

        rol: {
            type: String,
            enum: ["ADMIN", "VENDEDOR", "CLIENTE"],
            required: true
        },

        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente",
            default: null
        },

        vendedor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendedor",
            default: null
        },

        activo: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Evitar que un cliente tenga más de una cuenta
usuarioSchema.index(
    { cliente: 1 },
    {
        unique: true,
        partialFilterExpression: {
            cliente: { $type: "objectId" }
        }
    }
);

// Evitar que un vendedor tenga más de una cuenta
usuarioSchema.index(
    { vendedor: 1 },
    {
        unique: true,
        partialFilterExpression: {
            vendedor: { $type: "objectId" }
        }
    }
);

// Cifrar contraseña antes de guardar
usuarioSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(
        this.password,
        salt
    );
});

// Comparar contraseña ingresada con la almacenada
usuarioSchema.methods.compararPassword = async function (
    passwordIngresada
) {
    return await bcrypt.compare(
        passwordIngresada,
        this.password
    );
};

module.exports = mongoose.model("Usuario", usuarioSchema);