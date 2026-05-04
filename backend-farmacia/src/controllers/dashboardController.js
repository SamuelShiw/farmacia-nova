const pool = require("../config/db");

exports.resumenDashboard = async (req, res) => {
  try {
    const [[productos]] = await pool.query("SELECT COUNT(*) AS total_productos FROM productos");
    const [[ventas]] = await pool.query("SELECT COUNT(*) AS total_ventas FROM ventas");
    const [[ingresos]] = await pool.query("SELECT IFNULL(SUM(total), 0) AS total_ingresos FROM ventas");
    const [[stockBajo]] = await pool.query("SELECT COUNT(*) AS productos_stock_bajo FROM productos WHERE stock <= stock_minimo");
    const [[vencimientos]] = await pool.query(`
      SELECT COUNT(*) AS productos_por_vencer
      FROM productos
      WHERE fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    `);

    res.json({
      total_productos: productos.total_productos,
      total_ventas: ventas.total_ventas,
      total_ingresos: ingresos.total_ingresos,
      productos_stock_bajo: stockBajo.productos_stock_bajo,
      productos_por_vencer: vencimientos.productos_por_vencer
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener resumen",
      error: error.message
    });
  }
};