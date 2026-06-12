// panel.js
// Lógica principal del panel
// Maneja: estado de rutas, renderizado, modales y formularios

// ── Proteger la página ────────────────────────────────────
protegerPagina();

// ── Estado de las rutas ───────────────────────────────────
var listaRutas  = leerRutas();
var siguienteId = listaRutas.length > 0
  ? Math.max.apply(null, listaRutas.map(function (r) { return r.id; })) + 1
  : 1;

// ── Funciones que modifican el estado ────────────────────

function crearNuevaRuta(nombre, conductor, hora) {
  return {
    id:          siguienteId++,
    nombre:      nombre.trim(),
    conductor:   conductor.trim(),
    hora:        hora,
    estudiantes: [],
  };
}

function encontrarRutaPorId(id) {
  return listaRutas.find(function (r) { return r.id === id; });
}

function quitarRuta(id) {
  listaRutas = listaRutas.filter(function (r) { return r.id !== id; });
  guardarRutas(listaRutas);
}

function agregarEstudianteARuta(idRuta, nombreEstudiante) {
  var ruta = encontrarRutaPorId(idRuta);
  if (ruta) {
    ruta.estudiantes.push(nombreEstudiante.trim());
    guardarRutas(listaRutas);
  }
}

function quitarEstudianteDeRuta(idRuta, posicion) {
  var ruta = encontrarRutaPorId(idRuta);
  if (ruta) {
    ruta.estudiantes.splice(posicion, 1);
    guardarRutas(listaRutas);
  }
}

// ── Renderizado ───────────────────────────────────────────

function actualizarStats() {
  var statRutas = document.getElementById("stat-rutas");
  var statConductores = document.getElementById("stat-conductores");
  if (statRutas) statRutas.textContent = listaRutas.length;
  if (statConductores) statConductores.textContent = listaRutas.length;
}

function pintarRutasAdmin() {
  var cuadricula = document.getElementById("cuadricula-rutas-admin");
  var vacio      = document.getElementById("mensaje-vacio-admin");
  var contador   = document.getElementById("contador-rutas-admin");

  cuadricula.innerHTML = "";
  contador.textContent = listaRutas.length;
  actualizarStats();

  if (listaRutas.length === 0) {
    cuadricula.appendChild(vacio);
    return;
  }

  listaRutas.forEach(function (ruta) {
    var tarjeta        = document.createElement("tarjeta-ruta");
    tarjeta.datosRuta  = ruta;
    tarjeta.rolUsuario = "admin";
    cuadricula.appendChild(tarjeta);
  });
}

function pintarRutasProfesor() {
  var cuadricula = document.getElementById("cuadricula-rutas-profesor");
  var vacio      = document.getElementById("mensaje-vacio-profesor");
  var contador   = document.getElementById("contador-rutas-profesor");

  cuadricula.innerHTML = "";
  contador.textContent = listaRutas.length;

  if (listaRutas.length === 0) {
    cuadricula.appendChild(vacio);
    return;
  }

  listaRutas.forEach(function (ruta) {
    var tarjeta        = document.createElement("tarjeta-ruta");
    tarjeta.datosRuta  = ruta;
    tarjeta.rolUsuario = "profesor";
    cuadricula.appendChild(tarjeta);
  });
}

function pintarSegunRol() {
  if (obtenerRolActual() === "admin") pintarRutasAdmin();
  else pintarRutasProfesor();
}

// ── Modales ───────────────────────────────────────────────

function abrirModalEditar(id) {
  var ruta = encontrarRutaPorId(id);
  if (!ruta) return;
  document.getElementById("campo-id-editar").value        = ruta.id;
  document.getElementById("campo-nombre-editar").value    = ruta.nombre;
  document.getElementById("campo-conductor-editar").value = ruta.conductor;
  document.getElementById("campo-hora-editar").value      = ruta.hora;
  document.getElementById("modal-editar-ruta").hidden     = false;
}

function cerrarModalEditar() {
  document.getElementById("modal-editar-ruta").hidden = true;
  limpiarErroresCampos([
    { idCampo: "campo-nombre-editar",    idMensaje: "error-nombre-editar"    },
    { idCampo: "campo-conductor-editar", idMensaje: "error-conductor-editar" },
  ]);
}

function abrirModalAgregarEstudiante(idRuta) {
  document.getElementById("campo-id-ruta-estudiante").value        = idRuta;
  document.getElementById("campo-nombre-estudiante").value         = "";
  document.getElementById("error-nombre-estudiante").textContent   = "";
  document.getElementById("modal-agregar-estudiante").hidden       = false;
  document.getElementById("campo-nombre-estudiante").focus();
}

function cerrarModalAgregarEstudiante() {
  document.getElementById("modal-agregar-estudiante").hidden = true;
}

// Cierre de modales
document.getElementById("cerrar-modal-editar").addEventListener("click", cerrarModalEditar);
document.getElementById("cerrar-modal-estudiante").addEventListener("click", cerrarModalAgregarEstudiante);

document.getElementById("modal-editar-ruta").addEventListener("click", function (e) {
  if (e.target === document.getElementById("modal-editar-ruta")) cerrarModalEditar();
});

document.getElementById("modal-agregar-estudiante").addEventListener("click", function (e) {
  if (e.target === document.getElementById("modal-agregar-estudiante")) cerrarModalAgregarEstudiante();
});

// ── Formularios (solo si el elemento existe en el DOM) ────
// Se verifica con getElementById antes de adjuntar el evento
// porque cada rol solo ve su propia vista

// Formulario: Crear nueva ruta (solo admin)
var formNuevaRuta = document.getElementById("formulario-nueva-ruta");
if (formNuevaRuta) {
  formNuevaRuta.addEventListener("submit", function (e) {
    e.preventDefault();

    var eNombre    = validarCampoTexto(document.getElementById("campo-nombre-ruta").value);
    var eConductor = validarCampoTexto(document.getElementById("campo-conductor").value);
    var eHora      = validarCampoHora(document.getElementById("campo-hora").value);

    mostrarErrorCampo("campo-nombre-ruta", "error-nombre-ruta", eNombre);
    mostrarErrorCampo("campo-conductor",   "error-conductor",   eConductor);
    mostrarErrorCampo("campo-hora",        "error-hora",        eHora);
    if (eNombre || eConductor || eHora) return;

    var nuevaRuta = crearNuevaRuta(
      document.getElementById("campo-nombre-ruta").value,
      document.getElementById("campo-conductor").value,
      document.getElementById("campo-hora").value
    );
    listaRutas.push(nuevaRuta);
    guardarRutas(listaRutas);
    canalEventos.lanzar(NOMBRE_EVENTOS.RUTA_CREADA, { ruta: nuevaRuta });

    document.getElementById("formulario-nueva-ruta").reset();
    limpiarErroresCampos([
      { idCampo: "campo-nombre-ruta", idMensaje: "error-nombre-ruta" },
      { idCampo: "campo-conductor",   idMensaje: "error-conductor"   },
      { idCampo: "campo-hora",        idMensaje: "error-hora"        },
    ]);
    pintarRutasAdmin();
    mostrarNotificacion("✅ Ruta \"" + nuevaRuta.nombre + "\" creada.", "exito");
  });
}

// Formulario: Editar ruta
var formEditarRuta = document.getElementById("formulario-editar-ruta");
if (formEditarRuta) {
  formEditarRuta.addEventListener("submit", function (e) {
    e.preventDefault();

    var eNombre    = validarCampoTexto(document.getElementById("campo-nombre-editar").value);
    var eConductor = validarCampoTexto(document.getElementById("campo-conductor-editar").value);
    mostrarErrorCampo("campo-nombre-editar",    "error-nombre-editar",    eNombre);
    mostrarErrorCampo("campo-conductor-editar", "error-conductor-editar", eConductor);
    if (eNombre || eConductor) return;

    var ruta = encontrarRutaPorId(parseInt(document.getElementById("campo-id-editar").value));
    if (!ruta) return;

    ruta.nombre    = document.getElementById("campo-nombre-editar").value.trim();
    ruta.conductor = document.getElementById("campo-conductor-editar").value.trim();
    ruta.hora      = document.getElementById("campo-hora-editar").value;
    guardarRutas(listaRutas);

    cerrarModalEditar();
    pintarRutasAdmin();
    mostrarNotificacion("✏️ Ruta actualizada.", "exito");
  });
}

// Formulario: Agregar estudiante
var formAgregarEst = document.getElementById("formulario-agregar-estudiante");
if (formAgregarEst) {
  formAgregarEst.addEventListener("submit", function (e) {
    e.preventDefault();

    var eNombre = validarCampoTexto(document.getElementById("campo-nombre-estudiante").value, 2);
    mostrarErrorCampo("campo-nombre-estudiante", "error-nombre-estudiante", eNombre);
    if (eNombre) return;

    agregarEstudianteARuta(
      parseInt(document.getElementById("campo-id-ruta-estudiante").value),
      document.getElementById("campo-nombre-estudiante").value
    );
    cerrarModalAgregarEstudiante();
    pintarSegunRol();
    mostrarNotificacion("👦 Estudiante agregado.", "exito");
  });
}

// ── Escuchar eventos de las tarjetas ─────────────────────

canalEventos.escuchar(NOMBRE_EVENTOS.RUTA_EDITADA, function (datos) {
  abrirModalEditar(datos.id);
});

canalEventos.escuchar(NOMBRE_EVENTOS.RUTA_ELIMINADA, function (datos) {
  quitarRuta(datos.id);
  pintarRutasAdmin();
  mostrarNotificacion("🗑️ Ruta eliminada.");
});

canalEventos.escuchar(NOMBRE_EVENTOS.ESTUDIANTE_AGREGADO, function (datos) {
  abrirModalAgregarEstudiante(datos.id);
});

canalEventos.escuchar(NOMBRE_EVENTOS.ESTUDIANTE_ELIMINADO, function (datos) {
  quitarEstudianteDeRuta(datos.id, datos.posicion);
  pintarSegunRol();
  mostrarNotificacion("✕ Estudiante eliminado.");
});

// ── Cerrar sesión ─────────────────────────────────────────

document.getElementById("boton-cerrar-sesion").addEventListener("click", function () {
  cerrarSesionActual();
  window.location.href = "index.html";
});

// ── Inicializar el panel ──────────────────────────────────

function iniciarPanel() {
  var sesion = obtenerUsuarioActual();

  // Nombre y rol en el encabezado
  var insignia = document.getElementById("insignia-rol");
  insignia.textContent = sesion.rol === "admin" ? "Administrador" : "Profesor";

  // CORRECCIÓN: clase CSS correcta para el rol profesor
  insignia.classList.toggle("header__rol-badge--profesor", sesion.rol === "profesor");

  // Mostrar la vista según el rol
  document.getElementById("vista-administrador").hidden = sesion.rol !== "admin";
  document.getElementById("vista-profesor").hidden      = sesion.rol !== "profesor";

  // Cargar clima y pintar rutas
  mostrarClimaEnEncabezado();
  pintarSegunRol();
}

iniciarPanel();