📦 Backend – Sistema de Inventario y Ventas

Botica Nova Salud

📌 Descripción

Este backend corresponde al sistema web de gestión de inventario y ventas para la botica Nova Salud.
Está desarrollado con Node.js + Express, conectado a una base de datos MySQL en Aiven, y expone una API REST consumida por un frontend en React.

El sistema permite gestionar productos, registrar ventas tipo POS, controlar stock, generar alertas y administrar usuarios con roles.

🏗️ Arquitectura
Frontend (React)
        ↓
API REST (Node.js + Express)
        ↓
Base de datos (MySQL - Aiven)
⚙️ Tecnologías
Node.js
Express
MySQL (mysql2)
JWT (jsonwebtoken)
bcryptjs
dotenv
Docker
📁 Estructura del proyecto
backend-farmacia/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── initDB.js
│   │   ├── upgradePOS.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productoController.js
│   │   ├── ventaController.js
│   │   ├── alertaController.js
│   │   ├── dashboardController.js
│   │   ├── usuarioController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productoRoutes.js
│   │   ├── ventaRoutes.js
│   │   ├── alertaRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── usuarioRoutes.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │
│   ├── utils/
│   │   ├── validaciones.js
│
├── .env
├── Dockerfile
├── package.json
└── server.js
🔐 Autenticación

El sistema utiliza JWT.

Login
POST /api/auth/login
{
  "email": "admin@nova.com",
  "password": "admin123"
}
Roles
admin:
- gestiona productos
- gestiona usuarios
- ve reportes

vendedor:
- registra ventas
- consulta productos
- ve alertas
📦 Módulo Inventario
Endpoints
GET    /api/productos
POST   /api/productos
PUT    /api/productos/:id
DELETE /api/productos/:id
GET    /api/productos/buscar?texto=
Funcionalidades
Registro de productos
Control de stock
Stock mínimo
Código de barras
Fecha de vencimiento
💰 Módulo Ventas (POS)
Endpoints
POST /api/ventas
GET  /api/ventas
GET  /api/ventas/:id
Ejemplo
{
  "tipo_comprobante": "boleta",
  "metodo_pago": "yape",
  "cliente_nombre": "Cliente general",
  "cliente_documento": "00000000",
  "productos": [
    { "producto_id": 1, "cantidad": 2 }
  ]
}
Funcionalidades
Registro de ventas
Cálculo automático de totales
IGV
Descuento de stock
Detalle de venta
Historial
🚨 Módulo Alertas
Endpoints
GET /api/alertas/stock-bajo
GET /api/alertas/vencimientos
GET /api/alertas/vencidos
GET /api/alertas/criticos
Tipos de alertas
Stock bajo
Productos por vencer (30 días)
Productos vencidos
Productos críticos
📊 Dashboard
GET /api/dashboard/resumen
Información
Total productos
Total ventas
Ingresos
Stock bajo
Productos por vencer
👤 Módulo Usuarios
Endpoints
POST   /api/auth/register
GET    /api/usuarios
PUT    /api/usuarios/:id
DELETE /api/usuarios/:id
Funcionalidades
Registro de usuarios
Roles (admin / vendedor)
Edición de usuarios
Eliminación
🧠 Reglas de negocio
No se puede vender sin stock suficiente
No se puede vender cantidad <= 0
Solo admin puede gestionar productos
Solo admin puede gestionar usuarios
El stock se descuenta automáticamente
🐳 Docker
Construir imagen
docker build -t backend-farmacia .
Ejecutar contenedor
docker run --name backend-farmacia-container \
-p 3001:3000 \
--env-file .env \
backend-farmacia
▶️ Ejecución local
npm install
npm run dev

Servidor:

http://localhost:3000
📡 Pruebas

Ejemplo:

Invoke-RestMethod -Uri "http://localhost:3001/api/ventas" `
-Headers @{ "Authorization" = "Bearer TOKEN" }
🧾 Conclusión

El backend cumple con:

✔ Arquitectura desacoplada
✔ API REST funcional
✔ Control de inventario
✔ Sistema de ventas POS
✔ Alertas
✔ Seguridad con roles
✔ Persistencia en MySQL