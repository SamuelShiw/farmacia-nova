import { useEffect, useState } from "react";
import api from "../services/api";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});

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
    setErrores({});
  };

  const validarProducto = () => {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!form.categoria.trim()) {
      nuevosErrores.categoria = "La categoría es obligatoria";
    }

    if (!form.precio) {
      nuevosErrores.precio = "El precio es obligatorio";
    } else if (Number(form.precio) <= 0) {
      nuevosErrores.precio = "El precio debe ser mayor a 0";
    }

    if (form.stock === "") {
      nuevosErrores.stock = "El stock es obligatorio";
    } else if (Number(form.stock) < 0) {
      nuevosErrores.stock = "El stock no puede ser negativo";
    }

    if (form.stock_minimo === "") {
      nuevosErrores.stock_minimo = "El stock mínimo es obligatorio";
    } else if (Number(form.stock_minimo) < 0) {
      nuevosErrores.stock_minimo = "El stock mínimo no puede ser negativo";
    }

    if (form.codigo_barra && !/^\d+$/.test(form.codigo_barra)) {
      nuevosErrores.codigo_barra = "El código solo debe contener números";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (!validarProducto()) return;

    try {
      const productoData = {
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock),
        stock_minimo: Number(form.stock_minimo)
      };

      if (editandoId) {
        await api.put(`/productos/${editandoId}`, productoData);
        alert("Producto actualizado");
      } else {
        await api.post("/productos", productoData);
        alert("Producto creado");
      }

      limpiarForm();
      cargarProductos();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Error al guardar producto");
    }
  };

  const editarProducto = (producto) => {
    setEditandoId(producto.id);
    setErrores({});

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

    if (!cantidad || cantidad <= 0) {
      alert("Ingrese una cantidad válida mayor a 0");
      return;
    }

    const nuevoStock = Number(producto.stock) + cantidad;

    try {
      await api.put(`/productos/${producto.id}`, {
        codigo_barra: producto.codigo_barra || "",
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        categoria: producto.categoria || "",
        precio: Number(producto.precio),
        stock: nuevoStock,
        stock_minimo: Number(producto.stock_minimo),
        fecha_vencimiento: producto.fecha_vencimiento
          ? producto.fecha_vencimiento.split("T")[0]
          : ""
      });

      alert(`Stock actualizado. Nuevo stock: ${nuevoStock}`);
      cargarProductos();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Error al actualizar stock");
    }
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
          <div>
            <input
              placeholder="Código de barras"
              value={form.codigo_barra}
              className={errores.codigo_barra ? "input-error" : ""}
              onChange={(e) =>
                setForm({ ...form, codigo_barra: e.target.value })
              }
            />
            {errores.codigo_barra && (
              <small className="error-text">{errores.codigo_barra}</small>
            )}
          </div>

          <div>
            <input
              placeholder="Nombre"
              value={form.nombre}
              className={errores.nombre ? "input-error" : ""}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            {errores.nombre && (
              <small className="error-text">{errores.nombre}</small>
            )}
          </div>

          <div>
            <input
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>

          <div>
            <input
              placeholder="Categoría"
              value={form.categoria}
              className={errores.categoria ? "input-error" : ""}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            />
            {errores.categoria && (
              <small className="error-text">{errores.categoria}</small>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Precio"
              value={form.precio}
              className={errores.precio ? "input-error" : ""}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
            />
            {errores.precio && (
              <small className="error-text">{errores.precio}</small>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              className={errores.stock ? "input-error" : ""}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            {errores.stock && (
              <small className="error-text">{errores.stock}</small>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Stock mínimo"
              value={form.stock_minimo}
              className={errores.stock_minimo ? "input-error" : ""}
              onChange={(e) =>
                setForm({ ...form, stock_minimo: e.target.value })
              }
            />
            {errores.stock_minimo && (
              <small className="error-text">{errores.stock_minimo}</small>
            )}
          </div>

          <div>
            <input
              type="date"
              value={form.fecha_vencimiento}
              onChange={(e) =>
                setForm({ ...form, fecha_vencimiento: e.target.value })
              }
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editandoId ? "Actualizar" : "Crear"}
            </button>

            {editandoId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={limpiarForm}
              >
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

                <button
                  onClick={() => editarProducto(p)}
                  className="btn-secondary"
                >
                  Editar
                </button>

                <button
                  onClick={() => eliminarProducto(p.id)}
                  className="btn-danger"
                >
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