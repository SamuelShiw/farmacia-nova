const bcrypt = require("bcryptjs");
const pool = require("./db");

async function createVendedor() {
  try {
    const passwordHash = await bcrypt.hash("vendedor123", 10);

    await pool.query(
      `
      INSERT INTO usuarios (nombre, email, password, rol)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        password = VALUES(password),
        rol = VALUES(rol)
      `,
      ["Vendedor", "vendedor@nova.com", passwordHash, "vendedor"]
    );

    console.log("✅ Usuario vendedor creado/actualizado");
    console.log("📧 email: vendedor@nova.com");
    console.log("🔑 password: vendedor123");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createVendedor();