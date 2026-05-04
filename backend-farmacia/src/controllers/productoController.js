const pool = require("../config/db");
const { validarProducto } = require("../utils/validaciones");

exports.listarProductos = async (req, res) => {
  try {
    const [productos] = await pool.query("SELECT * FROM productos ORDER BY id DESC");
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al listar productos", error: error.message });
  }
};

exports.buscarProductos = async (req, res) => {
  try {
    const { texto } = req.query;

    if (!texto || texto.trim() === "") {
      return res.status(400).json({ message: "Debe enviar un texto para buscar" });
    }

    const [productos] = await pool.query(
      `SELECT * FROM productos
       WHERE nombre LIKE ? OR categoria LIKE ? OR codigo_barra LIKE ?
       ORDER BY nombre ASC`,
      [`%${texto}%`, `%${texto}%`, `%${texto}%`]
    );

    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar productos", error: error.message });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const errorValidacion = validarProducto(req.body);

    if (errorValidacion) {
      return res.status(400).json({ message: errorValidacion });
    }

    const {
      codigo_barra,
      nombre,
      descripcion,
      categoria,
      precio,
      stock,
      stock_minimo,
      fecha_vencimiento
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO productos 
      (codigo_barra, nombre, descripcion, categoria, precio, stock, stock_minimo, fecha_vencimiento)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo_barra || null, nombre, descripcion, categoria, precio, stock, stock_minimo, fecha_vencimiento]
    );

    res.status(201).json({
      message: "Producto creado correctamente",
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const errorValidacion = validarProducto(req.body);

    if (errorValidacion) {
      return res.status(400).json({ message: errorValidacion });
    }

    const { id } = req.params;

    const {
      codigo_barra,
      nombre,
      descripcion,
      categoria,
      precio,
      stock,
      stock_minimo,
      fecha_vencimiento
    } = req.body;

    const [result] = await pool.query(
      `UPDATE productos SET
      codigo_barra = ?, nombre = ?, descripcion = ?, categoria = ?, precio = ?, stock = ?, stock_minimo = ?, fecha_vencimiento = ?
      WHERE id = ?`,
      [codigo_barra || null, nombre, descripcion, categoria, precio, stock, stock_minimo, fecha_vencimiento, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error: error.message });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
};