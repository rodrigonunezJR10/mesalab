// db/conexion.js
const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Cambia según tu configuración
  password: '',        // Cambia según tu configuración
  database: 'mesalab_db'
});

conexion.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    return;
  }
  console.log('Conexión a MySQL establecida correctamente.');
});

module.exports = conexion;
