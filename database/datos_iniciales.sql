-- datos_iniciales.sql
USE mesalab_db;

-- Insertar roles
INSERT INTO roles (nombre_rol) VALUES ('Administrador'), ('Usuario');

-- Insertar usuarios (clave: admin123 y user123 — en producción usar hash)
INSERT INTO usuarios (nombre, correo, clave, id_rol, estado) VALUES
('Administrador Sistema', 'admin@mesalab.cl', 'admin123', 1, 1),
('Usuario Prueba', 'usuario@mesalab.cl', 'user123', 2, 1);

-- Insertar categorias
INSERT INTO categorias (nombre_categoria) VALUES
('Hardware'),
('Software'),
('Internet'),
('Cuenta institucional');

-- Insertar solicitudes de prueba
INSERT INTO solicitudes (id_usuario, id_categoria, titulo, descripcion, prioridad, estado) VALUES
(2, 1, 'Teclado no funciona', 'El teclado del computador del laboratorio 3 no responde al escribir.', 'Alta', 'Pendiente'),
(2, 2, 'Error al abrir Excel', 'Excel muestra error al intentar abrir archivos .xlsx en los computadores del aula.', 'Media', 'En proceso'),
(2, 3, 'Sin acceso a internet', 'Los computadores de la sala 5 no tienen conexión a internet desde ayer.', 'Alta', 'Pendiente');
