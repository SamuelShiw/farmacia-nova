const pool = require("../config/db");

exports.stockBajo = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT * FROM productos
      WHERE stock <= stock_minimo
      ORDER BY stock ASC
    `);

    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener stock bajo", error: error.message });
  }
};

exports.proximosVencer = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT * FROM productos
      WHERE fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY fecha_vencimiento ASC
    `);

    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener próximos vencimientos", error: error.message });
  }
};

exports.vencidos = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT * FROM productos
      WHERE fecha_vencimiento < CURDATE()
      ORDER BY fecha_vencimiento ASC
    `);

    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos vencidos", error: error.message });
  }
};

exports.criticos = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT *,
      CASE
        WHEN fecha_vencimiento < CURDATE() THEN 'VENCIDO'
        WHEN stock <= stock_minimo THEN 'STOCK_BAJO'
        WHEN fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'POR_VENCER'
        ELSE 'NORMAL'
      END AS estado_alerta
      FROM productos
      WHERE 
        stock <= stock_minimo
        OR fecha_vencimiento < CURDATE()
        OR fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY fecha_vencimiento ASC, stock ASC
    `);

    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos críticos", error: error.message });
  }
};