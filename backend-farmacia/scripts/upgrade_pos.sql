ALTER TABLE productos
ADD COLUMN codigo_barra VARCHAR(100) UNIQUE NULL AFTER id;

ALTER TABLE ventas
ADD COLUMN tipo_comprobante ENUM('boleta', 'factura') DEFAULT 'boleta' AFTER usuario_id,
ADD COLUMN metodo_pago ENUM('efectivo', 'tarjeta', 'yape', 'plin') DEFAULT 'efectivo' AFTER tipo_comprobante,
ADD COLUMN cliente_nombre VARCHAR(150) DEFAULT 'Cliente general' AFTER metodo_pago,
ADD COLUMN cliente_documento VARCHAR(20) NULL AFTER cliente_nombre,
ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0 AFTER cliente_documento,
ADD COLUMN igv DECIMAL(10,2) DEFAULT 0 AFTER subtotal,
ADD COLUMN estado ENUM('pagada', 'anulada') DEFAULT 'pagada' AFTER total;