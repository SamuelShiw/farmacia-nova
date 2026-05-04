import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import HistorialVentas from "./pages/HistorialVentas";
import DetalleVenta from "./pages/DetalleVenta";
import Alertas from "./pages/Alertas";
import Usuarios from "./pages/Usuarios";

import useAuth from "./hooks/useAuth";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import "./App.css";

// 🔥 Wrapper para poder usar useLocation dentro del router
function AppContent() {
  const { usuario, logout } = useAuth();
  const location = useLocation();

  const isLogin = location.pathname === "/";

  if (isLogin) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">◆</div>

          <div>
            <h2>Nova POS</h2>
            <p>Sistema de ventas</p>
          </div>
        </div>

        <nav className="menu">
          <NavLink to="/dashboard">Dashboard</NavLink>

          {usuario?.rol === "admin" && (
            <NavLink to="/productos">Productos</NavLink>
          )}

          <NavLink to="/ventas">Ventas</NavLink>
          <NavLink to="/historial-ventas">Historial</NavLink>
          <NavLink to="/alertas">Alertas</NavLink>

          {usuario?.rol === "admin" && (
            <NavLink to="/usuarios">Usuarios</NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div>
            <p>{usuario?.nombre || "Usuario"}</p>
            <span>{usuario?.rol || "Sesión activa"}</span>
          </div>

          <button onClick={logout} className="btn-danger">
            Salir
          </button>
        </div>
      </aside>

      <main className="app-content">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/productos"
            element={
              <AdminRoute>
                <Productos />
              </AdminRoute>
            }
          />

          <Route
            path="/ventas"
            element={
              <ProtectedRoute>
                <Ventas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/historial-ventas"
            element={
              <ProtectedRoute>
                <HistorialVentas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ventas/:id"
            element={
              <ProtectedRoute>
                <DetalleVenta />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alertas"
            element={
              <ProtectedRoute>
                <Alertas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <AdminRoute>
                <Usuarios />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;