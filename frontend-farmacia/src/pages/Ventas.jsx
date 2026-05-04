import { useEffect, useState } from "react";
import api from "../services/api";

export default function Ventas() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);

  const [tipoComprobante, setTipoComprobante] = useState("boleta");
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [cliente, setCliente] = useState("Cliente general");
  const [documento, setDocumento] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const res = await api.get("/productos");
    setProductos(res.data);
  };

  const buscar = async (texto) => {
    setBusqueda(texto);

    if (texto.trim() === "") {
      cargarProductos();
      return;
    }

    const res = await api.get(`/productos/buscar?texto=${texto}`);
    setProductos(res.data);
  };

  const agregarProducto = (producto) => {
    const existe = carrito.find((p) => p.id === producto.id);

    if (existe) {
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
    if (cantidad <= 0) return;

    setCarrito(
      carrito.map((p) =>
        p.id === id ? { ...p, cantidad: Number(cantidad) } : p
      )
    );
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
  };

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const registrarVenta = async () => {
    if (carrito.length === 0) {
      alert("Carrito vacío");
      return;
    }

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

      alert("Venta realizada");

      setCarrito([]);
      cargarProductos();
    } catch (error) {
      alert(error.response?.data?.message || "Error en venta");
    } finally {
      setLoading(false);
    }
  };

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
            onChange={(e) => buscar(e.target.value)}
          />

          <div className="product-list">
            {productos.map((p) => (
              <article className="product-item" key={p.id}>
                <div>
                  <h3>{p.nombre}</h3>
                  <p>
                    Stock: {p.stock} · S/ {Number(p.precio).toFixed(2)}
                  </p>
                </div>

                <button className="btn-add" onClick={() => agregarProducto(p)}>
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

            <input
              placeholder="Nombre cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />

            <input
              placeholder="Documento"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
            />
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