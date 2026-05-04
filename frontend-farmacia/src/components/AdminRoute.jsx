import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (usuario?.rol !== "admin") {
    return <Navigate to="/ventas" replace />;
  }

  return children;
}