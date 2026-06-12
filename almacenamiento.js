// src/js/almacenamiento.js
// Lee y guarda datos en LocalStorage
// Es el único archivo que habla con localStorage — el resto usa estas funciones

var CLAVE_SESION = "rsk_sesion";
var CLAVE_RUTAS  = "rsk_rutas";

// ── Sesión ────────────────────────────────────────────────

function guardarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
}

function leerSesion() {
  var datos = localStorage.getItem(CLAVE_SESION);
  return datos ? JSON.parse(datos) : null;
}

function borrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

function haySesionActiva() {
  return leerSesion() !== null;
}

// ── Rutas ─────────────────────────────────────────────────

function guardarRutas(listaRutas) {
  localStorage.setItem(CLAVE_RUTAS, JSON.stringify(listaRutas));
}

function leerRutas() {
  var datos = localStorage.getItem(CLAVE_RUTAS);
  return datos ? JSON.parse(datos) : [];
}
