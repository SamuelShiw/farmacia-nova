import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err.response?.data);
      alert("Error en login");
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-logo">◆</div>

        <h1>Nova POS</h1>
        <p>Accede al sistema de ventas e inventario</p>

        <input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="btn-primary">
          Ingresar
        </button>
      </div>
    </section>
  );
}