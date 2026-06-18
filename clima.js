// src/js/clima.js
// Consulta el clima actual usando la API pública Open-Meteo
// No requiere API key ni registro — https://open-meteo.com/
// La ciudad es configurable desde el panel y se guarda en LocalStorage

var CLAVE_CIUDAD_CLIMA = "rsk_ciudad_clima";

// Ciudad por defecto si el usuario nunca ha cambiado nada
var CIUDAD_POR_DEFECTO = {
  nombre:   "Girón, Colombia",
  latitud:  7.07,
  longitud: -73.11,
};

// Lista de ciudades predefinidas para el selector
var CIUDADES_DISPONIBLES = [
  { nombre: "Girón, Colombia",      latitud: 7.07,   longitud: -73.11 },
  { nombre: "Bogotá, Colombia",     latitud: 4.71,   longitud: -74.07 },
  { nombre: "Medellín, Colombia",   latitud: 6.25,   longitud: -75.56 },
  { nombre: "Cali, Colombia",       latitud: 3.45,   longitud: -76.53 },
  { nombre: "Bucaramanga, Colombia",latitud: 7.12,   longitud: -73.13 },
  { nombre: "Cartagena, Colombia",  latitud: 10.39,  longitud: -75.51 },
  { nombre: "Barranquilla, Colombia", latitud: 10.96, longitud: -74.80 },
];

// Tabla de códigos de condición climática con emoji y descripción
var CONDICIONES_CLIMA = {
  0:  { descripcion: "Despejado",            icono: "☀️"  },
  1:  { descripcion: "Mayormente despejado", icono: "🌤️" },
  2:  { descripcion: "Parcialmente nublado", icono: "⛅"  },
  3:  { descripcion: "Nublado",              icono: "☁️"  },
  45: { descripcion: "Niebla",               icono: "🌫️" },
  51: { descripcion: "Llovizna leve",        icono: "🌦️" },
  61: { descripcion: "Lluvia leve",          icono: "🌧️" },
  63: { descripcion: "Lluvia moderada",      icono: "🌧️" },
  80: { descripcion: "Chubascos",            icono: "🌦️" },
  95: { descripcion: "Tormenta",             icono: "⛈️" },
};

// ── Persistencia de la ciudad elegida ─────────────────────

function guardarCiudadClima(ciudad) {
  localStorage.setItem(CLAVE_CIUDAD_CLIMA, JSON.stringify(ciudad));
}

function leerCiudadClima() {
  var datos = localStorage.getItem(CLAVE_CIUDAD_CLIMA);
  return datos ? JSON.parse(datos) : CIUDAD_POR_DEFECTO;
}

// ── Consumo de la API ──────────────────────────────────────

// Hace la petición a la API y devuelve el clima actual de una ciudad
async function consultarClima(ciudad) {
  var url = "https://api.open-meteo.com/v1/forecast"
    + "?latitude="         + ciudad.latitud
    + "&longitude="        + ciudad.longitud
    + "&current_weather=true"
    + "&temperature_unit=celsius";

  var respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error("Error " + respuesta.status);
  var datos = await respuesta.json();
  return datos.current_weather;
}

// Muestra el clima en el encabezado del panel para la ciudad guardada
async function mostrarClimaEnEncabezado() {
  var elTemperatura = document.getElementById("clima-temperatura");
  var elIcono       = document.getElementById("clima-icono");
  var ciudad        = leerCiudadClima();

  elTemperatura.textContent = "Cargando...";

  try {
    var clima     = await consultarClima(ciudad);
    var condicion = CONDICIONES_CLIMA[clima.weathercode] || { descripcion: "Variable", icono: "🌡️" };
    elTemperatura.textContent = clima.temperature + "°C · " + condicion.descripcion;
    elIcono.textContent       = condicion.icono;
  } catch (error) {
    elTemperatura.textContent = "Sin datos";
    elIcono.textContent       = "❓";
    console.warn("[clima.js]", error.message);
  }
}

// ── Selector de ciudad en el panel ─────────────────────────

function inicializarSelectorCiudad() {
  var selector = document.getElementById("selector-ciudad-clima");
  if (!selector) return;

  // Llenar el selector con las ciudades disponibles
  selector.innerHTML = "";
  CIUDADES_DISPONIBLES.forEach(function (c) {
    var opcion = document.createElement("option");
    opcion.value       = c.nombre;
    opcion.textContent = c.nombre;
    selector.appendChild(opcion);
  });

  // Marcar la ciudad actualmente guardada como seleccionada
  var ciudadActual = leerCiudadClima();
  selector.value = ciudadActual.nombre;

  // Al cambiar de ciudad, guardar y refrescar el clima
  selector.addEventListener("change", function () {
    var elegida = CIUDADES_DISPONIBLES.find(function (c) {
      return c.nombre === selector.value;
    });
    if (!elegida) return;
    guardarCiudadClima(elegida);
    mostrarClimaEnEncabezado();
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion("🌍 Ciudad actualizada a " + elegida.nombre + ".", "exito");
    }
  });
}
