import { useEffect, useState } from "react";
import api from "../services/api";

export default function Alertas() {
  const [criticos, setCriticos] = useState([]);

  useEffect(() => {
    api.get("/alertas/criticos")
      .then(res => setCriticos(res.data))
      .catch(() => alert("Error cargando alertas"));
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Alertas de Inventario</h1>
          <p>Productos con stock crítico o próximos a vencer</p>
        </div>
      </div>

      <section className="card">
        {criticos.length === 0 && (
          <p className="empty-message">No hay productos críticos.</p>
        )}

        <div className="data-list">
          {criticos.map(p => (
            <article className="data-row" key={p.id}>
              <div>
                <h3>{p.nombre}</h3>
                <p>Stock: {p.stock} · Stock mínimo: {p.stock_minimo}</p>
                <p>Vence: {p.fecha_vencimiento || "Sin fecha"}</p>
              </div>

              <span className="badge-danger">
                {p.estado_alerta}
              </span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}