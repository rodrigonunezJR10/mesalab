//conexion DB mysql
const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',        
  password: '',
  database: './db/conexion'
});

conexion.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    return;
  }
  console.log('Conexión a MySQL establecida correctamente.');
});

module.exports = conexion;
