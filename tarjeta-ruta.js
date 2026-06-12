// src/js/tarjeta-ruta.js
// Define el Web Component <tarjeta-ruta>
// Cada tarjeta muestra los datos de una ruta y se adapta según el rol del usuario
// Usa <template> y Shadow DOM para encapsular su estructura y estilos

class TarjetaRuta extends HTMLElement {

  constructor() {
    super();
    // Crea el Shadow DOM y clona la plantilla HTML
    this.attachShadow({ mode: "open" });
    var plantilla = document.getElementById("plantilla-tarjeta-ruta");
    this.shadowRoot.appendChild(plantilla.content.cloneNode(true));
  }

  // Se llama automáticamente cuando la tarjeta se inserta en el DOM
  connectedCallback() {
    this._pintarDatos();
    this._escucharBotones();
  }

  // Propiedad para pasar el objeto ruta desde afuera
  set datosRuta(ruta) {
    this._ruta = ruta;
    if (this.shadowRoot.querySelector(".tarjeta")) this._pintarDatos();
  }

  get datosRuta() { return this._ruta; }

  // Propiedad para indicar qué rol tiene el usuario que ve la tarjeta
  set rolUsuario(rol) {
    this._rol = rol;
    this._ajustarBotonesSegunRol();
  }

  // Muestra u oculta botones según si el usuario es admin o profesor
  _ajustarBotonesSegunRol() {
    var accionesAdmin   = this.shadowRoot.getElementById("tarjeta-acciones-admin");
    var botonAgregarEst = this.shadowRoot.getElementById("boton-agregar-estudiante");
    if (this._rol === "admin") {
      accionesAdmin.style.display   = "flex";
      botonAgregarEst.style.display = "none";
    } else {
      accionesAdmin.style.display   = "none";
      botonAgregarEst.style.display = "block";
    }
  }

  // Pinta los campos de texto de la tarjeta con los datos de la ruta
  _pintarDatos() {
    if (!this._ruta) return;
    this.shadowRoot.getElementById("tarjeta-nombre").textContent    = this._ruta.nombre;
    this.shadowRoot.getElementById("tarjeta-conductor").textContent = this._ruta.conductor;
    this.shadowRoot.getElementById("tarjeta-hora").textContent      = this._ruta.hora;
    this._pintarListaEstudiantes();
  }

  // Pinta la lista de estudiantes dentro de la tarjeta
  _pintarListaEstudiantes() {
    var lista          = this.shadowRoot.getElementById("tarjeta-lista-estudiantes");
    var mensajeVacio   = this.shadowRoot.getElementById("tarjeta-sin-estudiantes");
    var contadorTotal  = this.shadowRoot.getElementById("tarjeta-contador");
    var total          = (this._ruta.estudiantes && this._ruta.estudiantes.length) || 0;

    lista.innerHTML          = "";
    contadorTotal.textContent = total;
    mensajeVacio.hidden       = total > 0;

    this._ruta.estudiantes.forEach(function (nombreEstudiante, posicion) {
      var elemento = document.createElement("li");
      elemento.className = "tarjeta__item-estudiante";
      elemento.appendChild(document.createTextNode("👦 " + nombreEstudiante));

      var botonEliminar = document.createElement("button");
      botonEliminar.className        = "tarjeta__boton-quitar-estudiante";
      botonEliminar.textContent      = "✕";
      botonEliminar.title            = "Quitar estudiante";
      botonEliminar.dataset.posicion = posicion;
      elemento.appendChild(botonEliminar);

      lista.appendChild(elemento);
    });
  }

  // Conecta los botones de la tarjeta con el canal de eventos
  _escucharBotones() {
    var yo = this;

    // Botón editar (solo admin)
    this.shadowRoot.getElementById("boton-editar-tarjeta").addEventListener("click", function () {
      canalEventos.lanzar(NOMBRE_EVENTOS.RUTA_EDITADA, { id: yo._ruta.id });
    });

    // Botón eliminar (solo admin)
    this.shadowRoot.getElementById("boton-eliminar-tarjeta").addEventListener("click", function () {
      if (confirm("¿Eliminar la ruta \"" + yo._ruta.nombre + "\"?")) {
        canalEventos.lanzar(NOMBRE_EVENTOS.RUTA_ELIMINADA, { id: yo._ruta.id });
      }
    });

    // Botón agregar estudiante (solo profesor)
    this.shadowRoot.getElementById("boton-agregar-estudiante").addEventListener("click", function () {
      canalEventos.lanzar(NOMBRE_EVENTOS.ESTUDIANTE_AGREGADO, { id: yo._ruta.id });
    });

    // Delegación: clic en cualquier botón "quitar estudiante" de la lista
    this.shadowRoot.getElementById("tarjeta-lista-estudiantes").addEventListener("click", function (evento) {
      var boton = evento.target.closest(".tarjeta__boton-quitar-estudiante");
      if (!boton) return;
      canalEventos.lanzar(NOMBRE_EVENTOS.ESTUDIANTE_ELIMINADO, {
        id:       yo._ruta.id,
        posicion: parseInt(boton.dataset.posicion),
      });
    });
  }
}

customElements.define("tarjeta-ruta", TarjetaRuta);
