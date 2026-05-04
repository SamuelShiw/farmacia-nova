const express = require("express");
const router = express.Router();

const {
  stockBajo,
  proximosVencer,
  vencidos,
  criticos
} = require("../controllers/alertaController");

const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/stock-bajo", verifyToken, stockBajo);
router.get("/vencimientos", verifyToken, proximosVencer);
router.get("/vencidos", verifyToken, vencidos);
router.get("/criticos", verifyToken, criticos);

module.exports = router;