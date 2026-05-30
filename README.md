# MesaLab — Sistema de Gestión de Solicitudes

Sistema web de soporte técnico institucional construido con **HTML, CSS, JavaScript, Node.js y MySQL**.

---

## Requisitos previos

- Node.js instalado
- MySQL corriendo localmente
- Navegador web moderno

---

## Instalación y ejecución

### 1. Clonar o descargar el proyecto

```bash
git clone URL_DEL_REPOSITORIO
cd mesalab
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos MySQL

Abrir MySQL y ejecutar:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/datos_iniciales.sql
```

O desde MySQL Workbench / consola:

```sql
SOURCE database/schema.sql;
SOURCE database/datos_iniciales.sql;
```

### 4. Configurar conexión

Editar `db/conexion.js` y ajustar las credenciales MySQL:

```js
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Tu usuario MySQL
  password: '',       // Tu contraseña MySQL
  database: 'mesalab_db'
});
```

### 5. Iniciar el servidor

```bash
node server.js
```

El servidor corre en: **http://localhost:3000**

---

## Credenciales de prueba

| Rol           | Correo                  | Contraseña |
|---------------|-------------------------|------------|
| Administrador | admin@mesalab.cl        | admin123   |
| Usuario       | usuario@mesalab.cl      | user123    |

---

## Estructura del proyecto

```
mesalab/
├── database/
│   ├── schema.sql          # Creación de tablas
│   └── datos_iniciales.sql # Datos de prueba
├── db/
│   └── conexion.js         # Conexión a MySQL
├── public/
│   ├── index.html          # Página de inicio
│   ├── login.html          # Formulario de login
│   ├── panel.html          # Panel de gestión
│   ├── css/
│   │   └── estilos.css     # Estilos propios
│   └── js/
│       ├── app.js          # Lógica frontend + fetch
│       └── validaciones.js # Validaciones JS
├── server.js               # Servidor Node.js (puerto 3000)
├── package.json
└── README.md
```

---

## Funcionalidades implementadas

1. **Inicio de sesión** — Valida correo y clave contra tabla `usuarios`
2. **Registro de solicitud** — Formulario con título, descripción, categoría y prioridad
3. **Listado de solicitudes** — Tabla HTML con datos desde MySQL
4. **Actualización de estado** — Cambiar entre Pendiente / En proceso / Resuelta
5. **Validaciones** — Frontend (JS) y backend (Node.js)
6. **Persistencia** — Datos en MySQL, persisten aunque se reinicie el servidor
7. **Diseño responsivo** — CSS propio, adaptable a pantallas pequeñas
8. **Colaboración** — Repositorio GitHub con commits de ambos integrantes

---

## Endpoints API

| Método | Ruta                              | Descripción               |
|--------|-----------------------------------|---------------------------|
| POST   | /api/login                        | Autenticación de usuario  |
| GET    | /api/solicitudes                  | Listar todas las solicitudes |
| POST   | /api/solicitudes                  | Registrar nueva solicitud |
| PUT    | /api/solicitudes/:id/estado       | Actualizar estado         |
| GET    | /api/categorias                   | Listar categorías         |
