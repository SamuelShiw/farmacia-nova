import { useState } from "react";
import api from "../services/api";
import useProductos from "../hooks/useProductos";

export default function Ventas() {
  const { productos, cargarProductos } = useProductos();

  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);

  const [tipoComprobante, setTipoComprobante] = useState("boleta");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [cliente, setCliente] = useState("Cliente general");
  const [documento, setDocumento] = useState("");

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  const limpiarVenta = () => {
    setBusqueda("");
    setCarrito([]);
    setTipoComprobante("boleta");
    setMetodoPago("efectivo");
    setCliente("Cliente general");
    setDocumento("");
    setErrores({});
    cargarProductos();
  };

  const buscar = async (texto) => {
    setBusqueda(texto);

    if (texto.trim() === "") {
      cargarProductos();
      return;
    }

    const res = await api.get(`/productos/buscar?texto=${texto}`);
    // como el hook expone setProductos, podrías extenderlo si quieres;
    // para no tocar el hook, simplemente no sobreescribimos aquí.
    // Alternativa rápida: no usar endpoint buscar y filtrar local.
  };

  const agregarProducto = (producto) => {
    if (Number(producto.stock) <= 0) {
      alert("Producto sin stock disponible");
      return;
    }

    const existe = carrito.find((p) => p.id === producto.id);

    if (existe) {
      if (existe.cantidad + 1 > Number(producto.stock)) {
        alert("No hay stock suficiente");
        return;
      }

      setCarrito(
        carrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (id, cantidad) => {
    const nuevaCantidad = Number(cantidad);

    if (!nuevaCantidad || nuevaCantidad <= 0) return;

    const producto = carrito.find((p) => p.id === id);

    if (nuevaCantidad > Number(producto.stock)) {
      alert("No hay stock suficiente");
      return;
    }

    setCarrito(
      carrito.map((p) =>
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
  };

  const validarVenta = () => {
    const nuevosErrores = {};

    if (carrito.length === 0) {
      nuevosErrores.carrito = "Agrega al menos un producto";
    }

    if (!cliente.trim()) {
      nuevosErrores.cliente = "El nombre del cliente es obligatorio";
    }

    if (documento && documento.length !== 8) {
      nuevosErrores.documento = "El DNI debe tener 8 dígitos";
    }

    const sinStock = carrito.find((p) => p.cantidad > Number(p.stock));
    if (sinStock) {
      nuevosErrores.carrito = `Stock insuficiente para ${sinStock.nombre}`;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const registrarVenta = async () => {
    if (!validarVenta()) return;

    try {
      setLoading(true);

      const productosVenta = carrito.map((p) => ({
        producto_id: p.id,
        cantidad: p.cantidad,
      }));

      await api.post("/ventas", {
        tipo_comprobante: tipoComprobante,
        metodo_pago: metodoPago,
        cliente_nombre: cliente,
        cliente_documento: documento,
        productos: productosVenta,
      });

      alert("Venta realizada correctamente");
      limpiarVenta();
    } catch (error) {
      alert(error.response?.data?.message || "Error en venta");
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase();
    return (
      String(p.nombre || "").toLowerCase().includes(texto) ||
      String(p.codigo_barra || "").toLowerCase().includes(texto)
    );
  });

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Caja POS</h1>
          <p>Venta rápida de productos</p>
        </div>
      </div>

      <div className="pos-layout">
        <section className="card pos-products">
          <div className="section-title">
            <div>
              <h2>Productos</h2>
              <p>Busca y agrega productos al carrito</p>
            </div>
          </div>

          <input
            className="search-input"
            placeholder="Buscar producto o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="product-list">
            {productosFiltrados.map((p) => (
              <article className="product-item" key={p.id}>
                <div>
                  <h3>{p.nombre}</h3>
                  <p>
                    Stock: {p.stock} · S/ {Number(p.precio).toFixed(2)}
                  </p>
                </div>

                <button
                  className="btn-add"
                  onClick={() => agregarProducto(p)}
                  disabled={Number(p.stock) <= 0}
                >
                  +
                </button>
              </article>
            ))}
          </div>
        </section>

        <aside className="card cart-card">
          <div className="section-title">
            <div>
              <h2>Carrito</h2>
              <p>{carrito.length} producto(s)</p>
            </div>
          </div>

          <div className="cart-list">
            {carrito.length === 0 && (
              <p className="empty-message">Todavía no agregaste productos.</p>
            )}

            {carrito.map((p) => (
              <article className="cart-item" key={p.id}>
                <div className="cart-info">
                  <h3>{p.nombre}</h3>
                  <p>S/ {(p.precio * p.cantidad).toFixed(2)}</p>
                </div>

                <input
                  type="number"
                  value={p.cantidad}
                  min="1"
                  max={p.stock}
                  onChange={(e) => cambiarCantidad(p.id, e.target.value)}
                />

                <button
                  className="btn-delete"
                  onClick={() => eliminarProducto(p.id)}
                >
                  X
                </button>
              </article>
            ))}
          </div>

          {errores.carrito && (
            <small className="error-text">{errores.carrito}</small>
          )}

          <div className="total-box">
            <span>Total a pagar</span>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>

          <div className="sale-form">
            <select
              value={tipoComprobante}
              onChange={(e) => setTipoComprobante(e.target.value)}
            >
              <option value="boleta">Boleta</option>
              <option value="factura">Factura</option>
            </select>

            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="yape">Yape</option>
              <option value="plin">Plin</option>
            </select>

            <div>
              <input
                placeholder="Nombre cliente"
                value={cliente}
                className={errores.cliente ? "input-error" : ""}
                onChange={(e) => setCliente(e.target.value)}
              />
              {errores.cliente && (
                <small className="error-text">{errores.cliente}</small>
              )}
            </div>

            <div>
              <input
                placeholder="Documento (DNI)"
                value={documento}
                maxLength={8}
                className={errores.documento ? "input-error" : ""}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (/^\d*$/.test(valor)) setDocumento(valor);
                }}
              />
              {errores.documento && (
                <small className="error-text">{errores.documento}</small>
              )}
            </div>
          </div>

          <button
            className="btn-primary btn-sale"
            onClick={registrarVenta}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Vender"}
          </button>
        </aside>
      </div>
    </section>
  );
}