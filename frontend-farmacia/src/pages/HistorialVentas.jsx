import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    api.get("/ventas")
      .then(res => setVentas(res.data))
      .catch(() => alert("Error cargando ventas"));
  }, []);

  const ventasFiltradas = ventas.filter((v) => {
    const texto = busqueda.toLowerCase();

    return (
      String(v.id).includes(texto) ||
      String(v.cliente_nombre || "").toLowerCase().includes(texto) ||
      String(v.tipo_comprobante || "").toLowerCase().includes(texto) ||
      String(v.metodo_pago || "").toLowerCase().includes(texto) ||
      String(v.fecha || v.created_at || "").toLowerCase().includes(texto)
    );
  });

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Historial de Ventas</h1>
          <p>Consulta y filtra las ventas registradas</p>
        </div>
      </div>

      <section className="card">
        <input
          className="search-input"
          placeholder="Buscar por cliente, ID, fecha, comprobante o método de pago..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="data-list">
          {ventasFiltradas.length === 0 && (
            <p className="empty-message">No se encontraron ventas.</p>
          )}

          {ventasFiltradas.map(v => (
            <article className="data-row" key={v.id}>
              <div>
                <h3>Venta #{v.id}</h3>
                <p>
                  {v.tipo_comprobante} · {v.metodo_pago} · Cliente: {v.cliente_nombre}
                </p>
                <p>
                  Total: S/ {Number(v.total).toFixed(2)}
                  {v.fecha && ` · Fecha: ${v.fecha}`}
                  {v.created_at && ` · Fecha: ${v.created_at}`}
                </p>
              </div>

              <div className="row-actions">
                <Link className="btn-link" to={`/ventas/${v.id}`}>
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}