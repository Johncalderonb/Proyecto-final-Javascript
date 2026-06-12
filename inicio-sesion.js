// inicio-sesion.js
// Controla la pantalla de login (index.html)
// Al autenticarse correctamente redirige a panel.html

var rolElegido = "admin";

// ── Si ya hay sesión activa, ir directo al panel ──────────
if (haySesionActiva()) {
  window.location.href = "panel.html";
}

// ── Cambiar rol seleccionado ──────────────────────────────

document.getElementById("boton-rol-admin").addEventListener("click", function () {
  rolElegido = "admin";
  // CORRECCIÓN: clase CSS correcta es login-rol__btn--activo
  document.getElementById("boton-rol-admin").classList.add("login-rol__btn--activo");
  document.getElementById("boton-rol-profesor").classList.remove("login-rol__btn--activo");
  document.getElementById("texto-credenciales").innerHTML =
    "Usuario: <strong>admin</strong> &nbsp;|&nbsp; Contraseña: <strong>admin123</strong>";
});

document.getElementById("boton-rol-profesor").addEventListener("click", function () {
  rolElegido = "profesor";
  // CORRECCIÓN: clase CSS correcta es login-rol__btn--activo
  document.getElementById("boton-rol-profesor").classList.add("login-rol__btn--activo");
  document.getElementById("boton-rol-admin").classList.remove("login-rol__btn--activo");
  document.getElementById("texto-credenciales").innerHTML =
    "Usuario: <strong>profesor</strong> &nbsp;|&nbsp; Contraseña: <strong>profe456</strong>";
});

// ── Mostrar / ocultar contraseña ──────────────────────────

document.getElementById("boton-ver-contrasena").addEventListener("click", function () {
  var campoClave = document.getElementById("campo-contrasena");
  var boton      = document.getElementById("boton-ver-contrasena");
  if (campoClave.type === "password") {
    campoClave.type   = "text";
    boton.textContent = "🙈";
  } else {
    campoClave.type   = "password";
    boton.textContent = "👁️";
  }
});

// ── Envío del formulario ──────────────────────────────────

document.getElementById("formulario-login").addEventListener("submit", function (evento) {
  evento.preventDefault();

  var campoUsuario = document.getElementById("campo-usuario");
  var campoClave   = document.getElementById("campo-contrasena");
  var errorAcceso  = document.getElementById("error-acceso");

  var errorU = validarCampoTexto(campoUsuario.value, 2);
  var errorC = validarCampoTexto(campoClave.value, 2);
  mostrarErrorCampo("campo-usuario",    "error-usuario",    errorU);
  mostrarErrorCampo("campo-contrasena", "error-contrasena", errorC);
  if (errorU || errorC) return;

  var usuarioEncontrado = verificarCredenciales(campoUsuario.value.trim(), campoClave.value);

  if (!usuarioEncontrado) {
    errorAcceso.textContent = "Usuario o contraseña incorrectos.";
    campoClave.value = "";
    return;
  }

  if (usuarioEncontrado.rol !== rolElegido) {
    errorAcceso.textContent = "Este usuario no tiene el rol seleccionado.";
    campoClave.value = "";
    return;
  }

  errorAcceso.textContent = "";
  abrirSesion(usuarioEncontrado);
  window.location.href = "panel.html";
});