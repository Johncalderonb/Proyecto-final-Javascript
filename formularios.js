// src/js/formularios.js
// Funciones para validar campos y mostrar/limpiar mensajes de error
// Se usan tanto en el login como en el panel

// Valida que un campo de texto no esté vacío y tenga un mínimo de caracteres
// Devuelve un mensaje de error o null si es válido
function validarCampoTexto(valor, minimoCaracteres) {
  var minimo = minimoCaracteres || 3;
  var limpio = valor.trim();
  if (limpio.length === 0) return "Este campo es obligatorio.";
  if (limpio.length < minimo) return "Debe tener al menos " + minimo + " caracteres.";
  return null;
}

// Valida que se haya seleccionado una hora
function validarCampoHora(valor) {
  if (!valor) return "La hora de salida es obligatoria.";
  return null;
}

// Marca visualmente un campo como inválido y muestra el mensaje de error
// Si mensaje es null, limpia el error
function mostrarErrorCampo(idCampo, idMensaje, mensaje) {
  var campo   = document.getElementById(idCampo);
  var mensaje_el = document.getElementById(idMensaje);
  if (!campo || !mensaje_el) return;
  if (mensaje) {
    campo.classList.add("invalido");
    mensaje_el.textContent = mensaje;
  } else {
    campo.classList.remove("invalido");
    mensaje_el.textContent = "";
  }
}

// Limpia los errores de una lista de campos
// Recibe un arreglo de objetos { idCampo, idMensaje }
function limpiarErroresCampos(listaCampos) {
  listaCampos.forEach(function (item) {
    var campo   = document.getElementById(item.idCampo);
    var mensaje = document.getElementById(item.idMensaje);
    if (campo)   campo.classList.remove("invalido");
    if (mensaje) mensaje.textContent = "";
  });
}
