# Real Estate Platform

Aplicación Full Stack para la gestión y publicación de propiedades inmobiliarias.

El proyecto está dividido en dos aplicaciones independientes:

- **Backend** desarrollado con Node.js, Express, Prisma y PostgreSQL.
- **Frontend** desarrollado con React, TypeScript y Vite.

La aplicación permite administrar propiedades, autenticación mediante JWT, carga de imágenes y visualización pública de inmuebles.

---

# Arquitectura

```
real-estate-platform
│
├── Backend/
│   ├── src/
│   ├── prisma/
│   ├── uploads/
│   ├── package.json
│   └── ...
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# Tecnologías

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer
- Zod
- bcrypt
- Docker

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- TailwindCSS

---

# Características

## Públicas

- Listado de propiedades
- Detalle de propiedad
- Galería de imágenes
- Contacto mediante WhatsApp
- Login de usuarios

## Privadas

- Administración de propiedades
- Alta de propiedades
- Edición
- Eliminación
- Subida de imágenes
- Eliminación de imágenes
- Reordenamiento de imágenes
- Selección de imagen principal

---

# Autenticación

La autenticación se realiza mediante JWT.

El token se almacena en el navegador y es enviado automáticamente en cada petición mediante un interceptor de Axios.

---

# Variables de entorno

## Backend

Crear un archivo:

```
Backend/.env
```

Ejemplo:

```env
DATABASE_URL=
JWT_SECRET=
PORT=3000
UPLOAD_DIR=uploads/properties
```

---

## Frontend

Crear un archivo:

```
Frontend/.env
```

Ejemplo:

```env
VITE_API_URL=http://localhost:3000/api
```

---

# Instalación

## Clonar el repositorio

```bash
git clone <repository-url>
```

---

## Backend

```bash
cd Backend

npm install

npx prisma generate

npx prisma migrate dev

npm run dev
```

---

## Frontend

```bash
cd Frontend

npm install

npm run dev
```

---

# Base de datos

Aplicar migraciones:

```bash
npx prisma migrate dev
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

---

# Scripts

## Backend

```bash
npm run dev
npm run build
npm start
```

## Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

# API

## Autenticación

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
```

---

## Usuarios

```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

---

## Propiedades

```
GET    /api/properties
GET    /api/properties/:id

POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id
```

---

## Imágenes

```
POST   /api/properties/:id/images
DELETE /api/properties/images/:id
PATCH  /api/properties/images/:id/primary
PATCH  /api/properties/images/reorder
```

---

# Organización del proyecto

## Backend

```
src
│
├── config
├── errors
├── lib
├── middlewares
├── modules
├── routes
├── services
├── types
└── utils
```

---

## Frontend

```
src
│
├── api
├── components
├── hooks
├── pages
├── routes
├── services
├── styles
├── types
├── utils
└── assets
```

---

# Funcionalidades implementadas

- Arquitectura modular
- CRUD completo de propiedades
- Gestión de imágenes
- Autenticación JWT
- Autorización por roles
- Validaciones con Zod
- Consumo de API mediante Axios
- Responsive Design
- Dark Mode
- Carga de archivos mediante Multer

---

# Estado del proyecto

En desarrollo activo.

Se incorporarán nuevas funcionalidades y mejoras de forma incremental.

---

# Licencia

Este proyecto se distribuye bajo la licencia MIT.