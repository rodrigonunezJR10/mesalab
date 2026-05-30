// public/js/validaciones.js

/**
 * Valida que un campo no esté vacío.
 * @param {string} valor
 * @returns {boolean}
 */
function campoVacio(valor) {
  return !valor || valor.trim() === '';
}

/**
 * Valida formato de correo electrónico.
 * @param {string} correo
 * @returns {boolean}
 */
function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

/**
 * Valida que la descripción tenga al menos 10 caracteres.
 * @param {string} descripcion
 * @returns {boolean}
 */
function validarDescripcion(descripcion) {
  return descripcion && descripcion.trim().length >= 10;
}

/**
 * Muestra un mensaje de éxito o error en un elemento.
 * @param {string} elementoId - ID del elemento HTML
 * @param {string} texto - Mensaje a mostrar
 * @param {boolean} esExito - true para éxito, false para error
 */
function mostrarMensaje(elementoId, texto, esExito) {
  const el = document.getElementById(elementoId);
  if (!el) return;
  el.textContent = texto;
  el.className = 'mensaje ' + (esExito ? 'exito' : 'error');
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

/**
 * Valida el formulario de login.
 * Retorna objeto { valido, errores[] }
 */
function validarFormularioLogin(correo, clave) {
  const errores = [];
  if (campoVacio(correo)) errores.push('El correo es obligatorio.');
  else if (!validarCorreo(correo)) errores.push('El formato del correo no es válido.');
  if (campoVacio(clave)) errores.push('La contraseña es obligatoria.');
  return { valido: errores.length === 0, errores };
}

/**
 * Valida el formulario de nueva solicitud.
 * Retorna objeto { valido, errores[] }
 */
function validarFormularioSolicitud(titulo, descripcion, categoria, prioridad) {
  const errores = [];
  if (campoVacio(titulo)) errores.push('El título es obligatorio.');
  if (!validarDescripcion(descripcion)) errores.push('La descripción debe tener al menos 10 caracteres.');
  if (campoVacio(categoria)) errores.push('Debes seleccionar una categoría.');
  if (campoVacio(prioridad)) errores.push('Debes seleccionar una prioridad.');
  return { valido: errores.length === 0, errores };
}
