import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get("/dashboard/resumen")
      .then(res => setData(res.data))
      .catch(() => alert("Error cargando dashboard"));
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general del sistema</p>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>📦</span>
          <p>Total productos</p>
          <h2>{data.total_productos || 0}</h2>
        </article>

        <article className="stat-card">
          <span>🧾</span>
          <p>Total ventas</p>
          <h2>{data.total_ventas || 0}</h2>
        </article>

        <article className="stat-card success">
          <span>💰</span>
          <p>Total ingresos</p>
          <h2>S/ {Number(data.total_ingresos || 0).toFixed(2)}</h2>
        </article>

        <article className="stat-card warning">
          <span>⚠️</span>
          <p>Stock bajo</p>
          <h2>{data.productos_stock_bajo || 0}</h2>
        </article>

        <article className="stat-card danger">
          <span>⏳</span>
          <p>Por vencer</p>
          <h2>{data.productos_por_vencer || 0}</h2>
        </article>
      </div>
    </section>
  );
}