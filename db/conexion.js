//conexion DB mysql
const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'estudiante',        
  password: 'Informatica-165',
  database: 'mesalab_dbRNunez'
});

conexion.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    return;
  }
  console.log('Conexión a MySQL establecida correctamente.');
});

module.exports = conexion;
