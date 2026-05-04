import { useEffect, useState } from "react";
import api from "../services/api";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    codigo_barra: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    stock: "",
    stock_minimo: "",
    fecha_vencimiento: ""
  });

  const cargarProductos = async () => {
    const res = await api.get("/productos");
    setProductos(res.data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const limpiarForm = () => {
    setForm({
      codigo_barra: "",
      nombre: "",
      descripcion: "",
      categoria: "",
      precio: "",
      stock: "",
      stock_minimo: "",
      fecha_vencimiento: ""
    });
    setEditandoId(null);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (editandoId) {
      await api.put(`/productos/${editandoId}`, form);
      alert("Producto actualizado");
    } else {
      await api.post("/productos", form);
      alert("Producto creado");
    }

    limpiarForm();
    cargarProductos();
  };

  const editarProducto = (producto) => {
    setEditandoId(producto.id);

    setForm({
      codigo_barra: producto.codigo_barra || "",
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      categoria: producto.categoria || "",
      precio: producto.precio || "",
      stock: producto.stock || "",
      stock_minimo: producto.stock_minimo || "",
      fecha_vencimiento: producto.fecha_vencimiento
        ? producto.fecha_vencimiento.split("T")[0]
        : ""
    });
  };

  const eliminarProducto = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    await api.delete(`/productos/${id}`);
    alert("Producto eliminado");
    cargarProductos();
  };

  const sumarStock = async (producto) => {
    const cantidad = Number(prompt("Cantidad de stock a agregar:"));

    if (!cantidad || cantidad <= 0) return;

    await api.put(`/productos/${producto.id}`, {
      ...producto,
      stock: Number(producto.stock) + cantidad
    });

    alert("Stock actualizado");
    cargarProductos();
  };

  const productosFiltrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase();

    return (
      String(p.nombre || "").toLowerCase().includes(texto) ||
      String(p.codigo_barra || "").toLowerCase().includes(texto) ||
      String(p.categoria || "").toLowerCase().includes(texto) ||
      String(p.descripcion || "").toLowerCase().includes(texto)
    );
  });

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Gestión de Productos</h1>
          <p>Administra inventario, precios, stock y vencimientos</p>
        </div>
      </div>

      <section className="card">
        <div className="section-title">
          <div>
            <h2>{editandoId ? "Editar producto" : "Nuevo producto"}</h2>
            <p>Completa los datos del producto</p>
          </div>
        </div>

        <form className="product-form" onSubmit={guardarProducto}>
          <input
            placeholder="Código de barras"
            value={form.codigo_barra}
            onChange={(e) => setForm({ ...form, codigo_barra: e.target.value })}
          />

          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <input
            placeholder="Categoría"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          />

          <input
            type="number"
            placeholder="Precio"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <input
            type="number"
            placeholder="Stock mínimo"
            value={form.stock_minimo}
            onChange={(e) => setForm({ ...form, stock_minimo: e.target.value })}
          />

          <input
            type="date"
            value={form.fecha_vencimiento}
            onChange={(e) => setForm({ ...form, fecha_vencimiento: e.target.value })}
          />

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editandoId ? "Actualizar" : "Crear"}
            </button>

            {editandoId && (
              <button type="button" className="btn-secondary" onClick={limpiarForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card list-card">
        <div className="section-title">
          <div>
            <h2>Lista de productos</h2>
            <p>
              {productosFiltrados.length} de {productos.length} producto(s)
            </p>
          </div>
        </div>

        <input
          className="search-input"
          placeholder="Buscar por nombre, código, categoría o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="data-list">
          {productosFiltrados.length === 0 && (
            <p className="empty-message">No se encontraron productos.</p>
          )}

          {productosFiltrados.map((p) => (
            <article className="data-row" key={p.id}>
              <div>
                <h3>{p.nombre}</h3>
                <p>
                  Código: {p.codigo_barra || "Sin código"} · Categoría:{" "}
                  {p.categoria || "Sin categoría"}
                </p>
                <p>
                  S/ {Number(p.precio).toFixed(2)} · Stock: {p.stock} · Vence:{" "}
                  {p.fecha_vencimiento
                    ? p.fecha_vencimiento.split("T")[0]
                    : "Sin fecha"}
                </p>
              </div>

              <div className="row-actions">
                <button onClick={() => sumarStock(p)} className="btn-success">
                  + Stock
                </button>

                <button onClick={() => editarProducto(p)} className="btn-secondary">
                  Editar
                </button>

                <button onClick={() => eliminarProducto(p.id)} className="btn-danger">
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}