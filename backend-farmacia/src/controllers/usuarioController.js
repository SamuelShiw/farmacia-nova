const pool = require("../config/db");
const bcrypt = require("bcryptjs");

exports.listarUsuarios = async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      "SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY id DESC"
    );

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al listar usuarios", error: error.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !rol) {
      return res.status(400).json({ message: "Nombre, email y rol son obligatorios" });
    }

    if (!["admin", "vendedor"].includes(rol)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const [existe] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ? AND id != ?",
      [email, id]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: "El email ya está en uso" });
    }

    if (password && password.trim() !== "") {
      const passwordHash = await bcrypt.hash(password, 10);

      await pool.query(
        "UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?",
        [nombre, email, passwordHash, rol, id]
      );
    } else {
      await pool.query(
        "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?",
        [nombre, email, rol, id]
      );
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message
    });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.usuario.id) {
      return res.status(400).json({ message: "No puedes eliminar tu propio usuario" });
    }

    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
  }
};