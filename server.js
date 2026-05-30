// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const conexion = require('./db/conexion');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Helper: leer body de la request
function leerBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Helper: enviar JSON
function enviarJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper: servir archivos estáticos
function servirArchivo(res, filePath) {
  const extMap = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
  };
  const ext = path.extname(filePath);
  const contentType = extMap[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Archivo no encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  // Manejo de CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // ==================== RUTAS API ====================

  // POST /api/login
  if (url === '/api/login' && method === 'POST') {
    const body = await leerBody(req);
    const { correo, clave } = body;

    if (!correo || !clave) {
      return enviarJSON(res, 400, { error: 'Correo y clave son requeridos.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return enviarJSON(res, 400, { error: 'Formato de correo inválido.' });
    }

    const query = 'SELECT u.*, r.nombre_rol FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE u.correo = ? AND u.clave = ? AND u.estado = 1';
    conexion.query(query, [correo, clave], (err, results) => {
      if (err) {
        console.error('Error en login:', err);
        return enviarJSON(res, 500, { error: 'Error interno del servidor.' });
      }
      if (results.length === 0) {
        return enviarJSON(res, 401, { error: 'Credenciales incorrectas.' });
      }
      const usuario = results[0];
      return enviarJSON(res, 200, {
        mensaje: 'Login exitoso.',
        usuario: {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.nombre_rol
        }
      });
    });
    return;
  }

  // POST /api/solicitudes — Registrar solicitud
  if (url === '/api/solicitudes' && method === 'POST') {
    const body = await leerBody(req);
    const { id_usuario, id_categoria, titulo, descripcion, prioridad } = body;

    if (!id_usuario || !id_categoria || !titulo || !descripcion || !prioridad) {
      return enviarJSON(res, 400, { error: 'Todos los campos son obligatorios.' });
    }
    if (descripcion.length < 10) {
      return enviarJSON(res, 400, { error: 'La descripción debe tener al menos 10 caracteres.' });
    }

    const query = 'INSERT INTO solicitudes (id_usuario, id_categoria, titulo, descripcion, prioridad, estado) VALUES (?, ?, ?, ?, ?, "Pendiente")';
    conexion.query(query, [id_usuario, id_categoria, titulo, descripcion, prioridad], (err, result) => {
      if (err) {
        console.error('Error al registrar solicitud:', err);
        return enviarJSON(res, 500, { error: 'Error al registrar la solicitud.' });
      }
      return enviarJSON(res, 201, { mensaje: 'Solicitud registrada correctamente.', id: result.insertId });
    });
    return;
  }

  // GET /api/solicitudes — Listar solicitudes
  if (url === '/api/solicitudes' && method === 'GET') {
    const query = `
      SELECT s.id_solicitud, u.nombre AS usuario, c.nombre_categoria AS categoria,
             s.titulo, s.descripcion, s.prioridad, s.estado, s.fecha_creacion
      FROM solicitudes s
      JOIN usuarios u ON s.id_usuario = u.id_usuario
      JOIN categorias c ON s.id_categoria = c.id_categoria
      ORDER BY s.fecha_creacion DESC
    `;
    conexion.query(query, (err, results) => {
      if (err) {
        console.error('Error al listar solicitudes:', err);
        return enviarJSON(res, 500, { error: 'Error al obtener solicitudes.' });
      }
      return enviarJSON(res, 200, results);
    });
    return;
  }

  // PUT /api/solicitudes/:id — Actualizar estado
  const matchEstado = url.match(/^\/api\/solicitudes\/(\d+)\/estado$/);
  if (matchEstado && method === 'PUT') {
    const id = matchEstado[1];
    const body = await leerBody(req);
    const { estado } = body;

    const estadosValidos = ['Pendiente', 'En proceso', 'Resuelta'];
    if (!estado || !estadosValidos.includes(estado)) {
      return enviarJSON(res, 400, { error: 'Estado inválido. Use: Pendiente, En proceso o Resuelta.' });
    }

    conexion.query('UPDATE solicitudes SET estado = ? WHERE id_solicitud = ?', [estado, id], (err, result) => {
      if (err) {
        console.error('Error al actualizar estado:', err);
        return enviarJSON(res, 500, { error: 'Error al actualizar estado.' });
      }
      if (result.affectedRows === 0) {
        return enviarJSON(res, 404, { error: 'Solicitud no encontrada.' });
      }
      return enviarJSON(res, 200, { mensaje: 'Estado actualizado correctamente.' });
    });
    return;
  }

  // GET /api/categorias — Listar categorías
  if (url === '/api/categorias' && method === 'GET') {
    conexion.query('SELECT * FROM categorias', (err, results) => {
      if (err) {
        return enviarJSON(res, 500, { error: 'Error al obtener categorías.' });
      }
      return enviarJSON(res, 200, results);
    });
    return;
  }

  // ==================== ARCHIVOS ESTÁTICOS ====================

  let filePath = '';
  if (url === '/' || url === '/index.html') {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  } else if (url === '/login.html') {
    filePath = path.join(PUBLIC_DIR, 'login.html');
  } else if (url === '/panel.html') {
    filePath = path.join(PUBLIC_DIR, 'panel.html');
  } else {
    filePath = path.join(PUBLIC_DIR, url);
  }

  servirArchivo(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Servidor MesaLab corriendo en http://localhost:${PORT}`);
});
