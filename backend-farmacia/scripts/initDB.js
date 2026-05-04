const fs = require("fs");
const path = require("path");
const pool = require("./db");

async function initDB() {
  try {
    const filePath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(filePath, "utf8");

    await pool.query(sql);

    console.log("✅ Base de datos inicializada correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error inicializando DB:", error.message);
    process.exit(1);
  }
}

initDB();