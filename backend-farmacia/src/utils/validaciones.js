exports.validarProducto = (producto) => {
  const { nombre, precio, stock, stock_minimo } = producto;

  if (!nombre || nombre.trim() === "") return "El nombre del producto es obligatorio";
  if (precio === undefined || Number(precio) <= 0) return "El precio debe ser mayor a 0";
  if (stock === undefined || Number(stock) < 0) return "El stock no puede ser negativo";
  if (stock_minimo === undefined || Number(stock_minimo) < 0) return "El stock mínimo no puede ser negativo";

  return null;
};

exports.validarVenta = (productos) => {
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return "Debe enviar al menos un producto";
  }

  for (const item of productos) {
    if (!item.producto_id) return "Cada producto debe tener producto_id";
    if (!item.cantidad || Number(item.cantidad) <= 0) return "La cantidad debe ser mayor a 0";
  }

  return null;
};

exports.validarDatosVenta = (venta) => {
  const { tipo_comprobante, metodo_pago } = venta;

  if (!["boleta", "factura"].includes(tipo_comprobante)) {
    return "Tipo de comprobante inválido";
  }

  if (!["efectivo", "tarjeta", "yape", "plin"].includes(metodo_pago)) {
    return "Método de pago inválido";
  }

  return null;
};