# 🏥 Sistema Web de Inventario y Ventas – Nova Salud

Sistema web desarrollado para la gestión de inventario y ventas de la botica **Nova Salud**, implementado con una arquitectura moderna separada en Frontend y Backend.

---

## 🚀 Descripción

El sistema permite gestionar productos, registrar ventas tipo POS, controlar el stock en tiempo real, generar alertas de inventario y administrar usuarios con distintos roles.

Está diseñado para funcionar completamente en entorno web mediante una API REST.

---

## 🧱 Arquitectura del sistema


Frontend (React)
↓
API REST (Node.js + Express)
↓
Base de datos MySQL (Aiven)


✔ Arquitectura desacoplada  
✔ Comunicación vía HTTP (REST)  
✔ Escalable y mantenible  

---

## 📁 Estructura del proyecto


farmacia-nova/
├── frontend-farmacia/ → Interfaz de usuario (React)
├── backend-farmacia/ → API REST (Node.js)
└── README.md


---

## 📦 Módulos implementados

### Inventario
- Registro de productos
- Edición y eliminación
- Control de stock
- Botón de aumento rápido (+Stock)
- Control de vencimientos

### Ventas (POS)
- Carrito de compra
- Registro de ventas
- Cálculo automático de totales
- Descuento automático de stock
- Historial de ventas
- Detalle e impresión

### Alertas
- Stock bajo
- Productos por vencer
- Productos críticos

### Atención al cliente
- Búsqueda rápida de productos
- Flujo optimizado de venta

### Seguridad
- Login con JWT
- Roles: admin / vendedor
- Rutas protegidas

---

## ⚙️ Instalación y ejecución

### Backend


cd backend-farmacia
npm install
npm run dev


Servidor:

http://localhost:3000


---

### Frontend


cd frontend-farmacia
npm install
npm run dev


Aplicación:

http://localhost:5173


---

## 🔐 Credenciales de prueba


Admin:
email: admin@nova.com

password: admin123


---

## 📡 API REST (ejemplos)


GET /api/productos
POST /api/ventas
GET /api/alertas
POST /api/auth/login


---

## 📌 Características destacadas

✔ Sistema completo funcional  
✔ Interfaz moderna y responsive  
✔ Gestión de inventario en tiempo real  
✔ POS optimizado para ventas rápidas  
✔ Arquitectura profesional (Frontend + Backend)  
✔ Base de datos en la nube (Aiven)  

---

## 🧾 Conclusión

El sistema cumple con los requerimientos del trabajo final:

- Arquitectura desacoplada
- Módulos funcionales
- API REST operativa
- Interfaz fluida
- Manejo correcto de inventario y ventas

---

## 👨‍💻 Autor

J. Samuel Quispe Mamani

Proyecto desarrollado con fines académicos – SENATI