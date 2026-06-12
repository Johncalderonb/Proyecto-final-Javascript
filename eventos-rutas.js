// src/js/eventos-rutas.js
// Canal de comunicación entre componentes usando CustomEvent del navegador
// Permite que la tarjeta de ruta avise al panel sin conocerlo directamente

var canalEventos = {

  // Lanza un evento con datos adjuntos
  lanzar: function (nombreEvento, datos) {
    document.dispatchEvent(new CustomEvent(nombreEvento, {
      detail:  datos,
      bubbles: true,
    }));
  },

  // Escucha un evento y ejecuta una función cuando ocurre
  escuchar: function (nombreEvento, funcion) {
    document.addEventListener(nombreEvento, function (evento) {
      funcion(evento.detail);
    });
  },
};

// Nombres de los eventos que se usan en la aplicación
var NOMBRE_EVENTOS = {
  RUTA_CREADA:          "ruta:creada",
  RUTA_EDITADA:         "ruta:editada",
  RUTA_ELIMINADA:       "ruta:eliminada",
  ESTUDIANTE_AGREGADO:  "estudiante:agregado",
  ESTUDIANTE_ELIMINADO: "estudiante:eliminado",
};
