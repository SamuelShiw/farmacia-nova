const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productoRoutes = require("./routes/productoRoutes");
const ventaRoutes = require("./routes/ventaRoutes");
const alertaRoutes = require("./routes/alertaRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Farmacia Nova Salud funcionando"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/alertas", alertaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/usuarios", usuarioRoutes);

module.exports = app;