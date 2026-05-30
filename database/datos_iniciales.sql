-- 1. Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS mesalab_dbRNunez;
USE mesalab_dbRNunez;

-- ==========================================
-- 2. CREACIÓN DE TABLAS (Lo que faltaba)
-- ==========================================

-- Tabla roles
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);

-- Tabla categorias
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    id_rol INT,
    estado INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Tabla solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_categoria INT,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(20),
    estado VARCHAR(20),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);


-- ==========================================
-- 3. INSERCIÓN DE DATOS (Tus datos originales)
-- ==========================================

-- Insertar roles
INSERT INTO roles (nombre_rol) VALUES 
('Administrador'), 
('Usuario');

-- Insertar usuarios (Se asume id_usuario autoincremental, por eso no se pasa en el INSERT)
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