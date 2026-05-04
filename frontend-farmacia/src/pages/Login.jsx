import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);

  const validar = () => {
    const nuevosErrores = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      nuevosErrores.email = "El correo es obligatorio";
    } else if (!emailRegex.test(email)) {
      nuevosErrores.email = "Correo inválido (ej: admin@nova.com)";
    }

    if (!password) {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else if (password.length < 4) {
      nuevosErrores.password = "Mínimo 4 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleLogin = async () => {
    if (!validar()) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err.response?.data);
      setErrores({ general: "Correo o contraseña incorrectos" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-logo">◆</div>

        <h1>Nova POS</h1>
        <p>Accede al sistema de ventas e inventario</p>

        {/* EMAIL */}
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            className={errores.email ? "input-error" : ""}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errores.email && (
            <small className="error-text">{errores.email}</small>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            className={errores.password ? "input-error" : ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errores.password && (
            <small className="error-text">{errores.password}</small>
          )}
        </div>

        {/* ERROR GENERAL */}
        {errores.general && (
          <small className="error-text">{errores.general}</small>
        )}

        <button
          onClick={handleLogin}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </section>
  );
}