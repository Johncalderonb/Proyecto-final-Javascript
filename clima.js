// src/js/clima.js
// Consulta el clima actual usando la API pública Open-Meteo
// No requiere API key ni registro — https://open-meteo.com/

var LATITUD_CIUDAD  = 7.07;
var LONGITUD_CIUDAD = -73.11;

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

// Hace la petición a la API y devuelve el clima actual
async function consultarClima() {
  var url = "https://api.open-meteo.com/v1/forecast"
    + "?latitude="         + LATITUD_CIUDAD
    + "&longitude="        + LONGITUD_CIUDAD
    + "&current_weather=true"
    + "&temperature_unit=celsius";

  var respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error("Error " + respuesta.status);
  var datos = await respuesta.json();
  return datos.current_weather;
}

// Muestra el clima en el encabezado del panel
async function mostrarClimaEnEncabezado() {
  var elTemperatura = document.getElementById("clima-temperatura");
  var elIcono       = document.getElementById("clima-icono");
  try {
    var clima    = await consultarClima();
    var condicion = CONDICIONES_CLIMA[clima.weathercode] || { descripcion: "Variable", icono: "🌡️" };
    elTemperatura.textContent = clima.temperature + "°C · " + condicion.descripcion;
    elIcono.textContent       = condicion.icono;
  } catch (error) {
    elTemperatura.textContent = "Sin datos";
    elIcono.textContent       = "❓";
    console.warn("[clima.js]", error.message);
  }
}
