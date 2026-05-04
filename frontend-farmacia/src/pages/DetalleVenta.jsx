import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function DetalleVenta() {
  const { id } = useParams();
  const [detalle, setDetalle] = useState([]);
  const [venta, setVenta] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    api.get(`/ventas/${id}`)
      .then(res => setDetalle(res.data))
      .catch(() => alert("Error cargando detalle"));

    api.get("/ventas")
      .then(res => {
        const encontrada = res.data.find(v => Number(v.id) === Number(id));
        setVenta(encontrada);
      })
      .catch(() => console.log("No se pudo cargar datos generales"));
  }, [id]);

  const total = detalle.reduce((acc, item) => acc + Number(item.subtotal), 0);

  return (
    <section className="page">
      <div className="page-header print-hidden">
        <div>
          <h1>Detalle de Venta #{id}</h1>
          <p>Información completa del comprobante</p>
        </div>
      </div>

      <section className="card ticket-card">
        <div className="ticket-header">
          <h2>Nova POS</h2>
          <p>Comprobante de venta #{id}</p>
        </div>

        <div className="ticket-info">
          <p><strong>Fecha:</strong> {venta?.fecha || venta?.created_at || "No registrada"}</p>
          <p><strong>Cliente:</strong> {venta?.cliente_nombre || "Cliente general"}</p>
          <p><strong>Documento:</strong> {venta?.cliente_documento || "Sin documento"}</p>
          <p><strong>Comprobante:</strong> {venta?.tipo_comprobante || "No registrado"}</p>
          <p><strong>Método de pago:</strong> {venta?.metodo_pago || "No registrado"}</p>
          <p><strong>Usuario:</strong> {venta?.usuario_nombre || usuario?.nombre || "Usuario del sistema"}</p>
          <p><strong>Rol:</strong> {venta?.usuario_rol || usuario?.rol || "No registrado"}</p>
        </div>

        <div className="ticket-list">
          {detalle.map(item => (
            <article className="ticket-row" key={item.id}>
              <div>
                <strong>{item.producto}</strong>
                <p>
                  Cantidad: {item.cantidad} · Precio unitario: S/{" "}
                  {Number(item.precio_unitario).toFixed(2)}
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