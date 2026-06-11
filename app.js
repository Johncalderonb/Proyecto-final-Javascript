// ============================================================
// app.js — Código JavaScript completo de Rutas Seguras Kids
// Secciones:
// 1. Utilidades — validaciones
// 2. Servicio  — clima (API Open-Meteo)
// 3. Eventos   — eventBus con CustomEvent
// 4. Componente — Web Component <route-card>
// 5. Main      — lógica principal y renderizado
// ============================================================


// ============================================================
// 1. UTILIDADES — funciones puras de validación
// ============================================================

function validarTexto(valor, minCaracteres = 3) {
  const limpio = valor.trim();
  if (limpio.length === 0) {
    return "Este campo es obligatorio.";
  }
  if (limpio.length < minCaracteres) {
    return `Debe tener al menos ${minCaracteres} caracteres.`;
  }
  return null;
}

function validarHora(valor) {
  if (!valor) {
    return "La hora de salida es obligatoria.";
  }
  return null;
}

function mostrarError(inputId, mensajeId, mensaje) {
  const input = document.getElementById(inputId);
  const span = document.getElementById(mensajeId);
  if (mensaje) {
    input.classList.add("invalido");
    span.textContent = mensaje;
  } else {
    input.classList.remove("invalido");
    span.textContent = "";
  }
}

function limpiarErrores(campos) {
  campos.forEach(function (campo) {
    const input = document.getElementById(campo.inputId);
    const span = document.getElementById(campo.errorId);
    if (input) input.classList.remove("invalido");
    if (span) span.textContent = "";
  });
}


// ============================================================
// 2. SERVICIO — consumo de API Open-Meteo (gratuita, sin API key)
// Docs: https://open-meteo.com/
// ============================================================

const CIUDAD_LAT = 7.07;
const CIUDAD_LON = -73.11;

const CODIGOS_CLIMA = {
  0:  { descripcion: "Despejado",            icono: "☀️"  },
  1:  { descripcion: "Mayormente despejado", icono: "🌤️" },
  2:  { descripcion: "Parcialmente nublado", icono: "⛅"  },
  3:  { descripcion: "Nublado",              icono: "☁️"  },
  45: { descripcion: "Niebla",               icono: "🌫️" },
  48: { descripcion: "Niebla con escarcha",  icono: "🌫️" },
  51: { descripcion: "Llovizna leve",        icono: "🌦️" },
  61: { descripcion: "Lluvia leve",          icono: "🌧️" },
  63: { descripcion: "Lluvia moderada",      icono: "🌧️" },
  65: { descripcion: "Lluvia intensa",       icono: "🌧️" },
  80: { descripcion: "Chubascos",            icono: "🌦️" },
  95: { descripcion: "Tormenta",             icono: "⛈️" },
};

async function obtenerClima() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${CIUDAD_LAT}&longitude=${CIUDAD_LON}&current_weather=true&temperature_unit=celsius`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error("Error al consultar la API del clima");
  }
  const datos = await respuesta.json();
  return datos.current_weather;
}

async function cargarClimaEnHeader() {
  const elTemp  = document.getElementById("clima-temp");
  const elIcono = document.getElementById("clima-icono");
  try {
    const clima = await obtenerClima();
    const info  = CODIGOS_CLIMA[clima.weathercode] || { descripcion: "Variable", icono: "🌡️" };
    elTemp.textContent  = `${clima.temperature}°C · ${info.descripcion}`;
    elIcono.textContent = info.icono;
  } catch (error) {
    elTemp.textContent  = "Sin datos";
    elIcono.textContent = "❓";
    console.warn("climaService:", error.message);
  }
}


// ============================================================
// 3. EVENTOS — bus de eventos con CustomEvent
// ============================================================

const eventBus = {
  emitir: function (nombreEvento, detalle) {
    const evento = new CustomEvent(nombreEvento, {
      detail: detalle,
      bubbles: true,
    });
    document.dispatchEvent(evento);
  },
  escuchar: function (nombreEvento, callback) {
    document.addEventListener(nombreEvento, function (evento) {
      callback(evento.detail);
    });
  },
};

const EVENTOS = {
  RUTA_CREADA:          "ruta:creada",
  RUTA_ELIMINADA:       "ruta:eliminada",
  RUTA_EDITADA:         "ruta:editada",
  ESTUDIANTE_AGREGADO:  "estudiante:agregado",
  ESTUDIANTE_ELIMINADO: "estudiante:eliminado",
};


// ============================================================
// 4. COMPONENTE — Web Component <route-card> con Shadow DOM
// ============================================================

class RouteCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.getElementById("route-card-template");
    const clon = template.content.cloneNode(true);
    this.shadowRoot.appendChild(clon);
  }

  connectedCallback() {
    this._renderDatos();
    this._agregarEventos();
  }

  set datos(ruta) {
    this._ruta = ruta;
    if (this.shadowRoot.querySelector(".card")) {
      this._renderDatos();
    }
  }

  get datos() {
    return this._ruta;
  }

  _renderDatos() {
    if (!this._ruta) return;
    this.shadowRoot.getElementById("card-nombre").textContent    = this._ruta.nombre;
    this.shadowRoot.getElementById("card-conductor").textContent = this._ruta.conductor;
    this.shadowRoot.getElementById("card-hora").textContent      = this._ruta.hora;
    this._renderEstudiantes();
  }

  _renderEstudiantes() {
    const lista = this.shadowRoot.getElementById("card-lista");
    const vacio = this.shadowRoot.getElementById("card-vacio");
    lista.innerHTML = "";

    if (!this._ruta.estudiantes || this._ruta.estudiantes.length === 0) {
      vacio.hidden = false;
    } else {
      vacio.hidden = true;
      this._ruta.estudiantes.forEach(function (nombre, indice) {
        const li = document.createElement("li");
        li.className = "card__estudiante";

        const texto = document.createTextNode("👦 " + nombre);
        li.appendChild(texto);

        const btnEliminar = document.createElement("button");
        btnEliminar.className    = "card__btn-eliminar-est";
        btnEliminar.textContent  = "✕";
        btnEliminar.title        = "Eliminar estudiante";
        btnEliminar.dataset.indice = indice;
        li.appendChild(btnEliminar);

        lista.appendChild(li);
      }.bind(this));
    }
  }

  _agregarEventos() {
    const btnEditar      = this.shadowRoot.getElementById("btn-editar");
    const btnEliminar    = this.shadowRoot.getElementById("btn-eliminar");
    const btnAgregarEst  = this.shadowRoot.getElementById("btn-agregar-est");
    const listaEst       = this.shadowRoot.getElementById("card-lista");

    btnEditar.addEventListener("click", function () {
      eventBus.emitir(EVENTOS.RUTA_EDITADA, { id: this._ruta.id });
    }.bind(this));

    btnEliminar.addEventListener("click", function () {
      const confirmado = confirm("¿Eliminar la ruta \"" + this._ruta.nombre + "\"?");
      if (confirmado) {
        eventBus.emitir(EVENTOS.RUTA_ELIMINADA, { id: this._ruta.id });
      }
    }.bind(this));

    btnAgregarEst.addEventListener("click", function () {
      eventBus.emitir(EVENTOS.ESTUDIANTE_AGREGADO, { id: this._ruta.id });
    }.bind(this));

    listaEst.addEventListener("click", function (evento) {
      const btn = evento.target.closest(".card__btn-eliminar-est");
      if (!btn) return;
      const indice = parseInt(btn.dataset.indice);
      eventBus.emitir(EVENTOS.ESTUDIANTE_ELIMINADO, { id: this._ruta.id, indice: indice });
    }.bind(this));
  }
}

customElements.define("route-card", RouteCard);


// ============================================================
// 5. MAIN — lógica principal, estado y renderizado
// ============================================================

// --- ESTADO ---
let rutas = [];
let contadorId = 1;

// --- REFERENCIAS AL DOM ---
const formRuta       = document.getElementById("form-ruta");
const inputNombre    = document.getElementById("input-nombre");
const inputConductor = document.getElementById("input-conductor");
const inputHora      = document.getElementById("input-hora");

const rutasGrid    = document.getElementById("rutas-grid");
const mensajeVacio = document.getElementById("mensaje-vacio");
const contadorRutas = document.getElementById("contador-rutas");

const modalEditar    = document.getElementById("modal-editar");
const formEditar     = document.getElementById("form-editar");
const editarId       = document.getElementById("editar-id");
const editarNombre   = document.getElementById("editar-nombre");
const editarConductor = document.getElementById("editar-conductor");
const editarHora     = document.getElementById("editar-hora");

const modalEstudiante  = document.getElementById("modal-estudiante");
const formEstudiante   = document.getElementById("form-estudiante");
const estudianteRutaId = document.getElementById("estudiante-ruta-id");
const inputEstudiante  = document.getElementById("input-estudiante");

// --- FUNCIONES DE ESTADO ---

function crearRuta(nombre, conductor, hora) {
  return {
    id: contadorId++,
    nombre: nombre.trim(),
    conductor: conductor.trim(),
    hora: hora,
    estudiantes: [],
  };
}

function buscarRutaPorId(id) {
  return rutas.find(function (r) { return r.id === id; });
}

function eliminarRuta(id) {
  rutas = rutas.filter(function (r) { return r.id !== id; });
}

function agregarEstudiante(id, nombre) {
  var ruta = buscarRutaPorId(id);
  if (ruta) {
    ruta.estudiantes.push(nombre.trim());
  }
}

function eliminarEstudiante(idRuta, indice) {
  var ruta = buscarRutaPorId(idRuta);
  if (ruta) {
    ruta.estudiantes.splice(indice, 1);
  }
}

// --- RENDERIZADO ---

function renderizarRutas() {
  rutasGrid.innerHTML = "";
  contadorRutas.textContent = rutas.length;

  if (rutas.length === 0) {
    rutasGrid.appendChild(mensajeVacio);
    return;
  }

  rutas.forEach(function (ruta) {
    const tarjeta = document.createElement("route-card");
    tarjeta.datos = ruta;
    rutasGrid.appendChild(tarjeta);
  });
}

// --- TOAST ---

function mostrarToast(mensaje, tipo) {
  var toast = document.createElement("div");
  toast.className = "toast " + (tipo || "");
  toast.textContent = mensaje;
  document.body.appendChild(toast);

  setTimeout(function () { toast.classList.add("visible"); }, 10);
  setTimeout(function () {
    toast.classList.remove("visible");
    setTimeout(function () { toast.remove(); }, 300);
  }, 2500);
}

// --- MODALES ---

function abrirModalEditar(id) {
  var ruta = buscarRutaPorId(id);
  if (!ruta) return;
  editarId.value        = ruta.id;
  editarNombre.value    = ruta.nombre;
  editarConductor.value = ruta.conductor;
  editarHora.value      = ruta.hora;
  modalEditar.hidden    = false;
}

function cerrarModalEditar() {
  modalEditar.hidden = true;
  limpiarErrores([
    { inputId: "editar-nombre",    errorId: "editar-error-nombre" },
    { inputId: "editar-conductor", errorId: "editar-error-conductor" },
  ]);
}

function abrirModalEstudiante(id) {
  estudianteRutaId.value = id;
  inputEstudiante.value  = "";
  document.getElementById("error-estudiante").textContent = "";
  modalEstudiante.hidden = false;
  inputEstudiante.focus();
}

function cerrarModalEstudiante() {
  modalEstudiante.hidden = true;
}

// --- FORMULARIOS ---

formRuta.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var errorNombre    = validarTexto(inputNombre.value);
  var errorConductor = validarTexto(inputConductor.value);
  var errorHora      = validarHora(inputHora.value);

  mostrarError("input-nombre",    "error-nombre",    errorNombre);
  mostrarError("input-conductor", "error-conductor", errorConductor);
  mostrarError("input-hora",      "error-hora",      errorHora);

  if (errorNombre || errorConductor || errorHora) return;

  var nuevaRuta = crearRuta(inputNombre.value, inputConductor.value, inputHora.value);
  rutas.push(nuevaRuta);
  eventBus.emitir(EVENTOS.RUTA_CREADA, { ruta: nuevaRuta });

  formRuta.reset();
  limpiarErrores([
    { inputId: "input-nombre",    errorId: "error-nombre" },
    { inputId: "input-conductor", errorId: "error-conductor" },
    { inputId: "input-hora",      errorId: "error-hora" },
  ]);
  renderizarRutas();
  mostrarToast("✅ Ruta \"" + nuevaRuta.nombre + "\" creada.", "exito");
});

formEditar.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var errorNombre    = validarTexto(editarNombre.value);
  var errorConductor = validarTexto(editarConductor.value);

  mostrarError("editar-nombre",    "editar-error-nombre",    errorNombre);
  mostrarError("editar-conductor", "editar-error-conductor", errorConductor);

  if (errorNombre || errorConductor) return;

  var id   = parseInt(editarId.value);
  var ruta = buscarRutaPorId(id);
  if (!ruta) return;

  ruta.nombre    = editarNombre.value.trim();
  ruta.conductor = editarConductor.value.trim();
  ruta.hora      = editarHora.value;

  cerrarModalEditar();
  renderizarRutas();
  mostrarToast("✏️ Ruta actualizada.", "exito");
});

formEstudiante.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var errorEst = validarTexto(inputEstudiante.value, 2);
  mostrarError("input-estudiante", "error-estudiante", errorEst);
  if (errorEst) return;

  var id = parseInt(estudianteRutaId.value);
  agregarEstudiante(id, inputEstudiante.value);

  cerrarModalEstudiante();
  renderizarRutas();
  mostrarToast("👦 Estudiante agregado.", "exito");
});

// --- EVENTOS CERRAR MODALES ---

document.getElementById("btn-cerrar-modal").addEventListener("click", cerrarModalEditar);
document.getElementById("btn-cerrar-estudiante").addEventListener("click", cerrarModalEstudiante);

modalEditar.addEventListener("click", function (evento) {
  if (evento.target === modalEditar) cerrarModalEditar();
});

modalEstudiante.addEventListener("click", function (evento) {
  if (evento.target === modalEstudiante) cerrarModalEstudiante();
});

// --- ESCUCHA DE EVENTOS PERSONALIZADOS ---

eventBus.escuchar(EVENTOS.RUTA_ELIMINADA, function (detalle) {
  eliminarRuta(detalle.id);
  renderizarRutas();
  mostrarToast("🗑️ Ruta eliminada.");
});

eventBus.escuchar(EVENTOS.RUTA_EDITADA, function (detalle) {
  abrirModalEditar(detalle.id);
});

eventBus.escuchar(EVENTOS.ESTUDIANTE_AGREGADO, function (detalle) {
  abrirModalEstudiante(detalle.id);
});

eventBus.escuchar(EVENTOS.ESTUDIANTE_ELIMINADO, function (detalle) {
  eliminarEstudiante(detalle.id, detalle.indice);
  renderizarRutas();
  mostrarToast("✕ Estudiante eliminado.");
});

// --- INICIALIZACIÓN ---

function inicializar() {
  cargarClimaEnHeader();
  renderizarRutas();
}

inicializar();
