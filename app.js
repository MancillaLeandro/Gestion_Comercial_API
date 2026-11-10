const express = require("express");
const cors = require("cors");

const categoriaRoutes = require("./src/routes/categoriaRoutes");
const productoRoutes = require("./src/routes/productoRoutes");
const depositoRoutes = require("./src/routes/depositoRoutes");
const stockRoutes = require("./src/routes/stockRoutes");
const clienteRoutes = require("./src/routes/clienteRoutes");
const vendedorRoutes = require("./src/routes/vendedorRoutes");
const sucursalRoutes = require("./src/routes/sucursalRoutes");
const facturaRoutes = require("./src/routes/facturaRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API de Gestión Comercial funcionando correctamente"
    });
});

app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/depositos", depositoRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/vendedores", vendedorRoutes);
app.use("/api/sucursales", sucursalRoutes);
app.use("/api/facturas", facturaRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;