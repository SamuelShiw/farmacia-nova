import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function DetalleVenta() {
  const { id } = useParams();
  const [detalle, setDetalle] = useState([]);

  useEffect(() => {
    api.get(`/ventas/${id}`)
      .then(res => setDetalle(res.data))
      .catch(() => alert("Error cargando detalle"));
  }, [id]);

  const total = detalle.reduce((acc, item) => acc + Number(item.subtotal), 0);

  return (
    <section className="page">
      <div className="page-header print-hidden">
        <div>
          <h1>Detalle de Venta #{id}</h1>
          <p>Resumen de productos vendidos</p>
        </div>
      </div>

      <section className="card ticket-card">
        <div className="ticket-header">
          <h2>Nova POS</h2>
          <p>Comprobante de venta #{id}</p>
        </div>

        <div className="ticket-list">
          {detalle.map(item => (
            <article className="ticket-row" key={item.id}>
              <div>
                <strong>{item.producto}</strong>
                <p>
                  Cantidad: {item.cantidad} · Precio: S/ {Number(item.precio_unitario).toFixed(2)}
                </p>
              </div>

              <span>S/ {Number(item.subtotal).toFixed(2)}</span>
            </article>
          ))}
        </div>

        <div className="ticket-total">
          <span>Total</span>
          <strong>S/ {total.toFixed(2)}</strong>
        </div>

        <button onClick={() => window.print()} className="btn-primary print-hidden">
          Imprimir
        </button>
      </section>
    </section>
  );
}