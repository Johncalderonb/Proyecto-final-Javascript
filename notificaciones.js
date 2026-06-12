// src/js/notificaciones.js
// Muestra mensajes temporales en la esquina de la pantalla (toast)
// Tipos disponibles: "exito" (verde), "error" (rojo), sin tipo = azul por defecto

function mostrarNotificacion(mensaje, tipo) {
  var notificacion = document.createElement("div");
  notificacion.className  = "notificacion-toast " + (tipo || "");
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);

  // Aparece con animación después de un instante
  setTimeout(function () {
    notificacion.classList.add("notificacion-toast--visible");
  }, 10);

  // Desaparece a los 3 segundos
  setTimeout(function () {
    notificacion.classList.remove("notificacion-toast--visible");
    setTimeout(function () { notificacion.remove(); }, 300);
  }, 3000);
}
