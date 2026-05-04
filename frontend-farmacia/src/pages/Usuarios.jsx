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
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (editandoId) {
      await api.put(`/usuarios/${editandoId}`, form);
      alert("Usuario actualizado");
    } else {
      await api.post("/auth/register", form);
      alert("Usuario creado");
    }

    limpiarForm();
    cargarUsuarios();
  };

  const editarUsuario = (usuario) => {
    setEditandoId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol
    });
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
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder={editandoId ? "Nueva contraseña opcional" : "Contraseña"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

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