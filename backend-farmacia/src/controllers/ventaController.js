const pool = require("../config/db");
const { validarVenta, validarDatosVenta } = require("../utils/validaciones");

exports.crearVenta = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { productos } = req.body;
    const usuario_id = req.usuario.id;

    const {
      tipo_comprobante = "boleta",
      metodo_pago = "efectivo",
      cliente_nombre = "Cliente general",
      cliente_documento = null
    } = req.body;

    const errorDatosVenta = validarDatosVenta({ tipo_comprobante, metodo_pago });
    if (errorDatosVenta) {
      return res.status(400).json({ message: errorDatosVenta });
    }

    const errorValidacion = validarVenta(productos);
    if (errorValidacion) {
      return res.status(400).json({ message: errorValidacion });
    }

    await connection.beginTransaction();

    let total = 0;

    for (const item of productos) {
      const [rows] = await connection.query(
        "SELECT * FROM productos WHERE id = ?",
        [item.producto_id]
      );

      if (rows.length === 0) {
        throw new Error("Producto no encontrado");
      }

      const producto = rows[0];

      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      total += Number(producto.precio) * Number(item.cantidad);
    }

    const subtotalVenta = total / 1.18;
    const igvVenta = total - subtotalVenta;

    const [ventaResult] = await connection.query(
      `INSERT INTO ventas 
      (usuario_id, tipo_comprobante, metodo_pago, cliente_nombre, cliente_documento, subtotal, igv, total, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario_id,
        tipo_comprobante,
        metodo_pago,
        cliente_nombre,
        cliente_documento,
        subtotalVenta,
        igvVenta,
        total,
        "pagada"
      ]
    );

    const venta_id = ventaResult.insertId;

    for (const item of productos) {
      const [rows] = await connection.query(
        "SELECT * FROM productos WHERE id = ?",
        [item.producto_id]
      );

      const producto = rows[0];
      const subtotal = Number(producto.precio) * Number(item.cantidad);

      await connection.query(
        `INSERT INTO detalle_venta 
        (venta_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)`,
        [venta_id, item.producto_id, item.cantidad, producto.precio, subtotal]
      );

      await connection.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [item.cantidad, item.producto_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Venta registrada correctamente",
      venta_id,
      total,
      tipo_comprobante,
      metodo_pago
    });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
};

exports.listarVentas = async (req, res) => {
  try {
    const [ventas] = await pool.query(`
      SELECT 
        v.id,
        v.tipo_comprobante,
        v.metodo_pago,
        v.cliente_nombre,
        v.cliente_documento,
        v.subtotal,
        v.igv,
        v.total,
        v.estado,
        v.fecha,
        u.nombre AS vendedor
      FROM ventas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      ORDER BY v.id DESC
    `);

    res.json(ventas);
  } catch (error) {
    res.status(500).json({
      message: "Error al listar ventas",
      error: error.message
    });
  }
};

exports.detalleVenta = async (req, res) => {
  try {
    const { id } = req.params;

    const [detalle] = await pool.query(`
      SELECT 
        dv.id,
        p.nombre AS producto,
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal
      FROM detalle_venta dv
      INNER JOIN productos p ON dv.producto_id = p.id
      WHERE dv.venta_id = ?
    `, [id]);

    res.json(detalle);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener detalle de venta",
      error: error.message
    });
  }
};