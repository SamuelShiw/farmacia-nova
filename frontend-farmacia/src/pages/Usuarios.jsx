import { useEffect, useState } from "react";
import api from "../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "vendedor"
  });

  const [errores, setErrores] = useState({});

  const cargarUsuarios = async () => {
    const res = await api.get("/usuarios");
    setUsuarios(res.data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const limpiarForm = () => {
    setForm({
      nombre: "",
      email: "",
      password: "",
      rol: "vendedor"
    });
    setEditandoId(null);
    setErrores({});
  };

  // 🔥 VALIDACIONES
  const validar = () => {
    const nuevosErrores = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!form.email.trim()) {
      nuevosErrores.email = "El correo es obligatorio";
    } else if (!emailRegex.test(form.email)) {
      nuevosErrores.email = "Correo inválido (ej: admin@nova.com)";
    }

    if (!editandoId && !form.password) {
      nuevosErrores.password = "La contraseña es obligatoria";
    } else if (form.password && form.password.length < 6) {
      nuevosErrores.password = "Mínimo 6 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    try {
      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, form);
        alert("Usuario actualizado");
      } else {
        await api.post("/auth/register", form);
        alert("Usuario creado");
      }

      limpiarForm();
      cargarUsuarios();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  const editarUsuario = (usuario) => {
    setEditandoId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol
    });
    setErrores({});
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Eliminar usuario?")) return;

    await api.delete(`/usuarios/${id}`);
    alert("Usuario eliminado");
    cargarUsuarios();
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Administra accesos y roles del sistema</p>
        </div>
      </div>

      <section className="card">
        <div className="section-title">
          <div>
            <h2>{editandoId ? "Editar usuario" : "Nuevo usuario"}</h2>
            <p>Define nombre, correo, contraseña y rol</p>
          </div>
        </div>

        <form className="user-form" onSubmit={guardarUsuario}>
          
          {/* NOMBRE */}
          <div>
            <input
              placeholder="Nombre"
              value={form.nombre}
              className={errores.nombre ? "input-error" : ""}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />
            {errores.nombre && <small className="error-text">{errores.nombre}</small>}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email (ej: admin@nova.com)"
              value={form.email}
              className={errores.email ? "input-error" : ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            {errores.email && <small className="error-text">{errores.email}</small>}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              placeholder={editandoId ? "Nueva contraseña opcional" : "Contraseña"}
              value={form.password}
              className={errores.password ? "input-error" : ""}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            {errores.password && <small className="error-text">{errores.password}</small>}
          </div>

          {/* ROL */}
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="vendedor">Vendedor</option>
          </select>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editandoId ? "Actualizar" : "Crear"}
            </button>

            {editandoId && (
              <button type="button" className="btn-secondary" onClick={limpiarForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card list-card">
        <div className="section-title">
          <div>
            <h2>Lista de usuarios</h2>
            <p>{usuarios.length} usuario(s) registrados</p>
          </div>
        </div>

        <div className="data-list">
          {usuarios.map((u) => (
            <article className="data-row" key={u.id}>
              <div>
                <h3>{u.nombre}</h3>
                <p>{u.email}</p>
              </div>

              <div className="row-actions">
                <span className={u.rol === "admin" ? "badge-primary" : "badge-muted"}>
                  {u.rol}
                </span>

                <button onClick={() => editarUsuario(u)} className="btn-secondary">
                  Editar
                </button>

                <button onClick={() => eliminarUsuario(u.id)} className="btn-danger">
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