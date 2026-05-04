const express = require("express");
const router = express.Router();

const { resumenDashboard } = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/resumen", verifyToken, resumenDashboard);

module.exports = router;