const fs = require("fs");
const path = require("path");
const pool = require("./db");

async function upgradePOS() {
  try {
    const filePath = path.join(__dirname, "upgrade_pos.sql");
    const sql = fs.readFileSync(filePath, "utf8");

    await pool.query(sql);

    console.log("✅ Migración POS aplicada correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error aplicando migración POS:", error.message);
    process.exit(1);
  }
}

upgradePOS();   