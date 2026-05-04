const express = require("express");
const router = express.Router();

const {
  crearVenta,
  listarVentas,
  detalleVenta
} = require("../controllers/ventaController");

const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, crearVenta);
router.get("/", verifyToken, listarVentas);
router.get("/:id", verifyToken, detalleVenta);

module.exports = router;