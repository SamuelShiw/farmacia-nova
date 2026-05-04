const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/authController");
const { verifyToken, onlyAdmin } = require("../middlewares/authMiddleware");

router.post("/login", login);
router.post("/register", verifyToken, onlyAdmin, register);

module.exports = router;