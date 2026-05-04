# 🏥 Sistema Web de Inventario y Ventas - Nova Salud

Sistema web desarrollado para la gestión de inventario y ventas de la botica **Nova Salud**, implementado con una arquitectura moderna separada en Frontend y Backend.

---

## 🚀 Tecnologías utilizadas

### Frontend
- React (Vite)
- CSS moderno (responsive)
- Axios

### Backend
- Node.js
- Express
- MySQL (Aiven - base de datos online)
- JWT (autenticación)

---

## 🧱 Arquitectura

El sistema sigue una arquitectura desacoplada:


Frontend (React) → API REST → Backend (Node.js) → MySQL (Aiven)


---

## 📦 Módulos del sistema

### Inventario
- Registro de productos
- Edición y eliminación
- Control de stock
- Botón de aumento rápido de stock (+Stock)
- Control de fechas de vencimiento

### Ventas (POS)
- Registro de ventas
- Carrito de compras
- Cálculo automático del total
- Descuento automático del stock
- Historial de ventas
- Detalle de venta con opción de impresión

### Alertas
- Productos con stock bajo
- Productos próximos a vencer

### Atención al cliente
- Búsqueda rápida de productos
- Flujo optimizado de venta

### Seguridad
- Login con JWT
- Roles: admin / vendedor
- Rutas protegidas

---

## 🔌 API REST

Principales endpoints:


GET /productos
POST /productos
PUT /productos/:id
DELETE /productos/:id

POST /ventas
GET /ventas
GET /ventas/:id

GET /alertas

POST /auth/login
POST /auth/register

GET /usuarios


---

## ⚙️ Instalación y ejecución

### Backend

```bash
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev
🔐 Variables de entorno

Crear archivo .env en backend:

PORT=3001
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
🧪 Credenciales de prueba
Admin:
email: admin@nova.com
password: admin123
📸 Capturas

(Inserta aquí imágenes del sistema)

📌 Notas finales
El sistema es completamente funcional y accesible vía navegador.
El stock se actualiza automáticamente al registrar ventas.
El aumento de stock se realiza mediante el botón "+Stock" en productos.

👨‍💻 Autor

 J. Samuel Quispe Mamani

Proyecto desarrollado como trabajo final académico.