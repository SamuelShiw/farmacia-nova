const express = require("express");
const router = express.Router();

const {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  buscarProductos
} = require("../controllers/productoController");

const { verifyToken, onlyAdmin } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, listarProductos);
router.get("/buscar", verifyToken, buscarProductos);

router.post("/", verifyToken, onlyAdmin, crearProducto);
router.put("/:id", verifyToken, onlyAdmin, actualizarProducto);
router.delete("/:id", verifyToken, onlyAdmin, eliminarProducto);

module.exports = router;