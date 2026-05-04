const bcrypt = require("bcryptjs");
const pool = require("./db");

async function resetAdmin() {
  try {
    const passwordHash = await bcrypt.hash("admin123", 10);

    await pool.query(
      `
      INSERT INTO usuarios (nombre, email, password, rol)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        password = VALUES(password),
        rol = VALUES(rol)
      `,
      ["Administrador", "admin@nova.com", passwordHash, "admin"]
    );

    console.log("✅ Usuario admin creado/actualizado correctamente");
    console.log("📧 email: admin@nova.com");
    console.log("🔑 password: admin123");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

resetAdmin();