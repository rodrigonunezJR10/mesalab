# 🛠️ MesaLab — Plataforma Web de Soporte Técnico

MesaLab es un sistema de tickets e incidencias institucionales diseñado para optimizar la gestión de solicitudes técnicas. La aplicación cuenta con una arquitectura full-stack basada en tecnologías web estándar, persistencia de datos relacional y un diseño adaptativo.

---

## Puesta en Marcha

#1. Clonación del Proyecto
Obtén una copia local del repositorio ejecutando en tu terminal:
```bash
git clone URL_DEL_REPOSITORIO
cd mesalab

#2. npm install

#3. Inicialización de la Base de DatosAsegúrate de tener un servicio local de MySQL activo. Luego, importa la estructura y los registros de prueba.Desde la terminal:Bashmysql -u root -p < database/schema.sql


mysql -u root -p < database/datos_iniciales.sql
Desde entornos gráficos (como MySQL Workbench / Consola SQL):SQLSOURCE database/schema.sql;
SOURCE database/datos_iniciales.sql;


#4. Parámetros de ConexiónConfigura el acceso a tu instancia de base de datos modificando las credenciales dentro del archivo:
 db/conexion.js:JavaScriptconst conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Usuario de tu entorno MySQL
  password: '',       // Contraseña de tu entorno MySQL
  database: 'mesalab_db'
});


#5. Lanzamiento del ServidorInicia el entorno de ejecución backend:Bashnode server.js

 El sistema estará disponible para producción y pruebas en el puerto local: 
 "http://localhost:3000" Cuentas de Acceso (Entorno de Pruebas)Utiliza los siguientes perfiles preconfigurados para validar los flujos de la aplicación:
 Perfil AdministradorEmail: admin@mesalab.cl
 Password: admin123Perfil 
 Usuario ComúnEmail: usuario@mesalab.cl
 Password: user123
 
 
 📂 Organización del RepositorioPlaintextmesalab/
├── database/            # Scripts SQL (Tablas y carga inicial)
│   ├── schema.sql
│   └── datos_iniciales.sql
├── db/                  # Configuración y conector de BD
│   └── conexion.js
├── public/              # Archivos estáticos de la interfaz (Frontend)
│   ├── index.html       # Landing page
│   ├── login.html       # Interfaz de acceso
│   ├── panel.html       # Dashboard de gestión
│   ├── css/
│   │   └── estilos.css  # Hojas de estilo personalizadas
│   └── js/
│       ├── app.js       # Consumo de API (fetch) y lógica cliente
│       └── validaciones.js
├── server.js            # Punto de entrada de la aplicación (Node.js)
├── package.json         # Manifiesto del proyecto y dependencias
└── README.md            # Documentación general


Características del Sistema de la Autenticación Segura: Control de acceso mediante verificación de credenciales contra la base de datos en la tabla usuarios.

Gestión de Solicitudes: Formulario parametrizado para la creación de requerimientos 
(asunto, detalle, categorización y nivel de prioridad).

Monitoreo en Tiempo Real: Visualización dinámica de los datos almacenados a través de tablas dinámicas en el frontend.Flujo de Estados: Capacidad de transicionar los tickets entre las fases Pendiente, En proceso y Resuelta.
Control de Errores: Validaciones nativas duplicadas tanto en el cliente (JS) como en el servidor (Node.js) para garantizar la integridad de los datos.

Persistencia Robusta: Almacenamiento respaldado en un motor de bases de datos relacional (MySQL).

Responsividad: Estructura visual fluida optimizada mediante CSS adaptativo para todo tipo de dispositivos.🗺️ Catálogo de Endpoints (API)TipoRecursoObjetivo TécnicoPOST/api/loginProcesa y valida el inicio de sesión.GET/api/solicitudesRecupera la colección completa de requerimientos.POST/api/solicitudesDa de alta un nuevo ticket en el sistema.PUT/api/solicitudes/:id/estadoModifica el estado de avance de una solicitud específica.GET/api/categoriasObtiene los tipos de incidencias disponibles.