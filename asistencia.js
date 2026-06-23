function pintarListaAsistencia() {
  var contenedor = document.getElementById("lista-asistencia");
  var rutas = leerRutas();
  contenedor.innerHTML = "";

  rutas.forEach(function (ruta) {
    ruta.estudiantes.forEach(function (nombre) {
      contenedor.innerHTML += "<label style='display:block; margin-bottom:6px;'>"
        + "<input type='checkbox' data-nombre='" + nombre + "'> "
        + nombre + " (Ruta " + ruta.nombre + ")</label>";
    });
  });

  if (!contenedor.innerHTML) {
    contenedor.innerHTML = "<p class='mensaje-vacio'>Pa la casa que no hay estudiantes registrados..</p>";
  }
}

function guardarAsistencia() {
  var checkboxes = document.querySelectorAll("#lista-asistencia input");
  var html = "<h3>Resumen</h3>";

  checkboxes.forEach(function (c) {
    var color = c.checked ? "#e8f5e9" : "#fdecea";
    var texto = c.checked ? "✅ " : "❌ ";
    html += "<p style='background:" + color + "; padding:6px; border-radius:6px;'>"
      + texto + c.dataset.nombre + "</p>";
  });

  document.getElementById("resumen-asistencia").innerHTML = html;
  mostrarNotificacion("✅ Asistencia guardada.", "exito");
}

document.getElementById("boton-guardar-asistencia").addEventListener("click", guardarAsistencia);

pintarListaAsistencia();