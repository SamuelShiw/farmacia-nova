const express = require("express");
const router = express.Router();

const {
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario
} = require("../controllers/usuarioController");

const { verifyToken, onlyAdmin } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, onlyAdmin, listarUsuarios);
router.put("/:id", verifyToken, onlyAdmin, actualizarUsuario);
router.delete("/:id", verifyToken, onlyAdmin, eliminarUsuario);

module.exports = router;