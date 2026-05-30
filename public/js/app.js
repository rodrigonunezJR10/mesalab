// public/js/app.js

const API = 'http://localhost:3000/api';

// ============================================================
// SESIÓN
// ============================================================

function obtenerUsuario() {
  try {
    return JSON.parse(sessionStorage.getItem('usuario'));
  } catch { return null; }
}

function guardarUsuario(usuario) {
  sessionStorage.setItem('usuario', JSON.stringify(usuario));
}

// ============================================================
// LOGIN
// ============================================================

async function iniciarSesion() {
  const correo = document.getElementById('correo').value.trim();
  const clave  = document.getElementById('clave').value.trim();

  const { valido, errores } = validarFormularioLogin(correo, clave);
  if (!valido) {
    mostrarMensaje('mensaje', errores[0], false);
    return;
  }

  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, clave })
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarMensaje('mensaje', data.error || 'Error al iniciar sesión.', false);
      return;
    }

    guardarUsuario(data.usuario);
    mostrarMensaje('mensaje', '¡Bienvenido/a ' + data.usuario.nombre + '! Redirigiendo...', true);
    setTimeout(() => { window.location.href = 'panel.html'; }, 1200);

  } catch (err) {
    mostrarMensaje('mensaje', 'No se pudo conectar al servidor. Verifica que esté corriendo.', false);
  }
}

// Permitir Enter en login
if (document.getElementById('clave')) {
  document.getElementById('clave').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') iniciarSesion();
  });
}

// ============================================================
// PANEL
// ============================================================

// Mostrar info usuario en panel
window.addEventListener('DOMContentLoaded', () => {
  const infoBox = document.getElementById('user-info-box');
  if (!infoBox) return; // No es panel.html

  const usuario = obtenerUsuario();
  if (usuario) {
    document.getElementById('nombre-usuario').textContent = usuario.nombre;
    document.getElementById('rol-usuario').textContent = '— ' + (usuario.rol || 'Usuario');
    infoBox.style.display = 'block';
  }

  cargarCategorias();
  cargarSolicitudes();
});

// ============================================================
// CATEGORÍAS
// ============================================================

async function cargarCategorias() {
  try {
    const res = await fetch(`${API}/categorias`);
    const data = await res.json();
    const select = document.getElementById('categoria');
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona una categoría</option>';
    data.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.id_categoria;
      opt.textContent = cat.nombre_categoria;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Error al cargar categorías:', err);
  }
}

// ============================================================
// REGISTRAR SOLICITUD
// ============================================================

async function registrarSolicitud() {
  const titulo      = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const categoria   = document.getElementById('categoria').value;
  const prioridad   = document.getElementById('prioridad').value;

  const { valido, errores } = validarFormularioSolicitud(titulo, descripcion, categoria, prioridad);
  if (!valido) {
    mostrarMensaje('mensaje-solicitud', errores[0], false);
    return;
  }

  const usuario = obtenerUsuario();
  const id_usuario = usuario ? usuario.id_usuario : 2; // fallback usuario prueba

  try {
    const res = await fetch(`${API}/solicitudes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario, id_categoria: categoria, titulo, descripcion, prioridad })
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarMensaje('mensaje-solicitud', data.error || 'Error al registrar.', false);
      return;
    }

    mostrarMensaje('mensaje-solicitud', 'Solicitud registrada correctamente.', true);
    document.getElementById('titulo').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('prioridad').value = '';
    cargarSolicitudes();

  } catch (err) {
    mostrarMensaje('mensaje-solicitud', 'No se pudo conectar al servidor.', false);
  }
}

// ============================================================
// LISTAR SOLICITUDES
// ============================================================

async function cargarSolicitudes() {
  const tbody = document.getElementById('tabla-solicitudes');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:#94a3b8;">Cargando...</td></tr>';

  try {
    const res = await fetch(`${API}/solicitudes`);
    const data = await res.json();

    if (!res.ok || !Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:#94a3b8;">No hay solicitudes registradas.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(s => `
      <tr>
        <td>${s.id_solicitud}</td>
        <td>${escHTML(s.usuario)}</td>
        <td>${escHTML(s.categoria)}</td>
        <td>${escHTML(s.titulo)}</td>
        <td><span class="badge badge-${s.prioridad.toLowerCase()}">${s.prioridad}</span></td>
        <td><span class="badge badge-${badgeEstado(s.estado)}">${s.estado}</span></td>
        <td>${formatFecha(s.fecha_creacion)}</td>
        <td>
          <select class="select-estado" onchange="actualizarEstado(${s.id_solicitud}, this.value)">
            <option value="Pendiente"  ${s.estado==='Pendiente'  ? 'selected':''}>Pendiente</option>
            <option value="En proceso" ${s.estado==='En proceso' ? 'selected':''}>En proceso</option>
            <option value="Resuelta"   ${s.estado==='Resuelta'   ? 'selected':''}>Resuelta</option>
          </select>
        </td>
      </tr>
    `).join('');

  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:1.5rem; color:#ef4444;">Error al conectar con el servidor.</td></tr>';
  }
}

// ============================================================
// ACTUALIZAR ESTADO
// ============================================================

async function actualizarEstado(id, nuevoEstado) {
  try {
    const res = await fetch(`${API}/solicitudes/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    const data = await res.json();
    if (!res.ok) {
      alert('Error: ' + (data.error || 'No se pudo actualizar.'));
      return;
    }
    cargarSolicitudes();
  } catch (err) {
    alert('No se pudo conectar al servidor.');
  }
}

// ============================================================
// HELPERS
// ============================================================

function escHTML(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function badgeEstado(estado) {
  const map = { 'Pendiente': 'pendiente', 'En proceso': 'proceso', 'Resuelta': 'resuelta' };
  return map[estado] || 'pendiente';
}

function formatFecha(fecha) {
  if (!fecha) return '—';
  const d = new Date(fecha);
  return d.toLocaleDateString('es-CL') + ' ' + d.toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' });
}

// ============================================================
// THEME / PALETTE SWITCHER
// ============================================================

const THEME_OPTIONS = [null, 'theme-midnight', 'theme-sunset', 'theme-forest', 'alt-bg-1'];
const THEME_LABELS = {
  null: 'Predeterminado',
  'theme-midnight': 'Midnight',
  'theme-sunset': 'Sunset',
  'theme-forest': 'Forest',
  'alt-bg-1': 'Vibrante'
};

function applyTheme(name) {
  // limpiar clases conocidas
  THEME_OPTIONS.forEach(t => { if (t) document.body.classList.remove(t); });
  if (!name) {
    localStorage.removeItem('theme');
    updateThemeButtonLabel(null);
    return;
  }
  document.body.classList.add(name);
  localStorage.setItem('theme', name);
  updateThemeButtonLabel(name);
}

function updateThemeButtonLabel(name) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = THEME_LABELS[name];
}

function cycleTheme() {
  const current = THEME_OPTIONS.find(t => t && document.body.classList.contains(t)) || null;
  const idx = THEME_OPTIONS.indexOf(current);
  const next = THEME_OPTIONS[(idx + 1) % THEME_OPTIONS.length];
  applyTheme(next);
}

// Inicializar tema al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  const theme = saved && THEME_OPTIONS.includes(saved) ? saved : null;
  applyTheme(theme);

  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('click', cycleTheme);
});
