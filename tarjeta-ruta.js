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

  // Propiedad para resaltar coincidencias del buscador del panel
  set textoBusqueda(texto) {
    this._busqueda = texto || "";
    if (this.shadowRoot.querySelector(".tarjeta")) this._pintarDatos();
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

  // Envuelve las coincidencias del texto buscado en <mark> para resaltarlas
  _resaltar(texto) {
    if (!this._busqueda) return document.createTextNode(texto);
    var indice = texto.toLowerCase().indexOf(this._busqueda.toLowerCase());
    if (indice === -1) return document.createTextNode(texto);

    var fragmento = document.createDocumentFragment();
    var antes      = texto.slice(0, indice);
    var coincide   = texto.slice(indice, indice + this._busqueda.length);
    var despues    = texto.slice(indice + this._busqueda.length);

    if (antes)   fragmento.appendChild(document.createTextNode(antes));
    var marca = document.createElement("mark");
    marca.className  = "tarjeta__resaltado";
    marca.textContent = coincide;
    fragmento.appendChild(marca);
    if (despues) fragmento.appendChild(document.createTextNode(despues));

    return fragmento;
  }

  // Pinta los campos de texto de la tarjeta con los datos de la ruta
  _pintarDatos() {
    if (!this._ruta) return;

    var elNombre    = this.shadowRoot.getElementById("tarjeta-nombre");
    var elConductor = this.shadowRoot.getElementById("tarjeta-conductor");

    elNombre.innerHTML    = "";
    elNombre.appendChild(this._resaltar(this._ruta.nombre));

    elConductor.innerHTML = "";
    elConductor.appendChild(this._resaltar(this._ruta.conductor));

    this.shadowRoot.getElementById("tarjeta-hora").textContent = this._ruta.hora;
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

      var nombreSpan = document.createElement("span");
      nombreSpan.appendChild(document.createTextNode("👦 "));
      nombreSpan.appendChild(this._resaltar(nombreEstudiante));
      elemento.appendChild(nombreSpan);

      var acciones = document.createElement("span");
      acciones.className = "tarjeta__acciones-estudiante";

      // Botón editar estudiante (solo visible para admin y profesor)
      var botonEditar = document.createElement("button");
      botonEditar.className        = "tarjeta__boton-editar-estudiante";
      botonEditar.textContent      = "✏️";
      botonEditar.title            = "Editar estudiante";
      botonEditar.dataset.posicion = posicion;
      acciones.appendChild(botonEditar);

      var botonEliminar = document.createElement("button");
      botonEliminar.className        = "tarjeta__boton-quitar-estudiante";
      botonEliminar.textContent      = "✕";
      botonEliminar.title            = "Quitar estudiante";
      botonEliminar.dataset.posicion = posicion;
      acciones.appendChild(botonEliminar);

      elemento.appendChild(acciones);
      lista.appendChild(elemento);
    }.bind(this));
  }

  // Conecta los botones de la tarjeta con el canal de eventos
  _escucharBotones() {
    var yo = this;

    // Botón editar ruta (solo admin)
    this.shadowRoot.getElementById("boton-editar-tarjeta").addEventListener("click", function () {
      canalEventos.lanzar(NOMBRE_EVENTOS.RUTA_EDITADA, { id: yo._ruta.id });
    });

    // Botón eliminar ruta (solo admin)
    this.shadowRoot.getElementById("boton-eliminar-tarjeta").addEventListener("click", function () {
      if (confirm("¿Eliminar la ruta \"" + yo._ruta.nombre + "\"?")) {
        canalEventos.lanzar(NOMBRE_EVENTOS.RUTA_ELIMINADA, { id: yo._ruta.id });
      }
    });

    // Botón agregar estudiante (solo profesor)
    this.shadowRoot.getElementById("boton-agregar-estudiante").addEventListener("click", function () {
      canalEventos.lanzar(NOMBRE_EVENTOS.ESTUDIANTE_AGREGADO, { id: yo._ruta.id });
    });

    // Delegación: clic en cualquier botón "editar estudiante" de la lista
    this.shadowRoot.getElementById("tarjeta-lista-estudiantes").addEventListener("click", function (evento) {
      var botonEditar = evento.target.closest(".tarjeta__boton-editar-estudiante");
      if (botonEditar) {
        var posicion = parseInt(botonEditar.dataset.posicion);
        canalEventos.lanzar(NOMBRE_EVENTOS.ESTUDIANTE_EDITADO, {
          id:           yo._ruta.id,
          posicion:     posicion,
          nombreActual: yo._ruta.estudiantes[posicion],
        });
        return;
      }

      // Delegación: clic en cualquier botón "quitar estudiante" de la lista
      var botonQuitar = evento.target.closest(".tarjeta__boton-quitar-estudiante");
      if (botonQuitar) {
        canalEventos.lanzar(NOMBRE_EVENTOS.ESTUDIANTE_ELIMINADO, {
          id:       yo._ruta.id,
          posicion: parseInt(botonQuitar.dataset.posicion),
        });
      }
    });
  }
}

customElements.define("tarjeta-ruta", TarjetaRuta);
