// src/js/autenticacion.js
// Define los usuarios del sistema y gestiona la sesión activa
// La sesión se persiste en LocalStorage para sobrevivir recargas de página

var USUARIOS_DEL_SISTEMA = [
  { usuario: "admin",    contrasena: "admin123", rol: "admin",    nombre: "Administrador" },
  { usuario: "profesor", contrasena: "profe456", rol: "profesor", nombre: "Profesor"       },
];

// Busca un usuario que coincida con usuario y contraseña
// Devuelve el objeto usuario si lo encuentra, o null si no
function verificarCredenciales(usuario, contrasena) {
  return USUARIOS_DEL_SISTEMA.find(function (u) {
    return u.usuario === usuario && u.contrasena === contrasena;
  }) || null;
}

// Guarda el usuario en LocalStorage y en memoria
function abrirSesion(usuario) {
  guardarSesion(usuario);
}

// Elimina la sesión de LocalStorage
function cerrarSesionActual() {
  borrarSesion();
}

// Devuelve el objeto de la sesión activa (desde LocalStorage)
function obtenerUsuarioActual() {
  return leerSesion();
}

// Devuelve solo el rol del usuario activo ("admin" | "profesor" | null)
function obtenerRolActual() {
  var sesion = leerSesion();
  return sesion ? sesion.rol : null;
}

// Redirige al login si no hay sesión activa
// Se llama al inicio de panel.html para proteger la página
function protegerPagina() {
  if (!haySesionActiva()) {
    window.location.href = "index.html";
  }
}
