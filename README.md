# 🚌 KidGo — Rutas Seguras Kids

> Sistema frontend de gestión de transporte escolar con autenticación por roles, persistencia en LocalStorage y consumo de API pública.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-sin_frameworks-orange?style=flat)
![LocalStorage](https://img.shields.io/badge/LocalStorage-persistencia-green?style=flat)

---

## 📋 Descripción

**KidGo** es una aplicación web desarrollada con HTML, CSS y JavaScript puro (Vanilla JS), sin librerías ni frameworks externos. Permite a una empresa de transporte escolar gestionar rutas, conductores y estudiantes a través de dos roles con acceso diferenciado.

| Rol | Acceso |
|---|---|
| 🛡️ **Administrador** | Crear, editar y eliminar rutas; asignar conductores y horarios |
| 👨‍🏫 **Profesor** | Consultar rutas activas, agregar, editar y eliminar estudiantes |

---

## ✨ Características

- 🔐 Login con selección de rol y verificación de credenciales
- 💾 Persistencia en **LocalStorage** — rutas, sesión y ciudad del clima se mantienen al recargar la página
- 🚌 CRUD completo de rutas: **crear, editar y eliminar**
- 👦 CRUD completo de estudiantes: **agregar, editar y eliminar** por ruta
- 🔍 **Buscador en tiempo real** en ambos paneles, con resaltado visual de coincidencias en rutas, conductores y estudiantes
- 🌍 **Selector de ciudad** para el clima, editable desde la misma página, con 7 ciudades de Colombia disponibles
- 🌤️ Clima en tiempo real con la API pública **Open-Meteo** (sin API key)
- 🧩 Web Component `<tarjeta-ruta>` con `<template>` y **Shadow DOM**
- 📡 Comunicación entre componentes mediante **CustomEvent**
- 📊 Panel de identidad de empresa con contadores de rutas en tiempo real
- 🔔 Notificaciones toast de feedback al usuario
- 📱 Diseño responsive con 3 breakpoints (900px / 600px / 380px)
- 🔒 Protección de página: redirige al login si no hay sesión activa
- 🖼️ Soporte para logo de empresa en login y encabezado

---

## 🗂️ Estructura del proyecto

```
KidGo/
│
├── index.html              # Página de inicio de sesión
├── panel.html               # Panel principal (protegido — requiere sesión activa)
├── styles.css                # Estilos completos del proyecto
├── README.md
├── .gitignore
│
├── imagenes/                 # Logo y capturas del proyecto
│   ├── logo.png
│   └── ...capturas
│
└── js/
    ├── almacenamiento.js     # Lee y guarda sesión, rutas y ciudad del clima en LocalStorage
    ├── autenticacion.js      # Usuarios, roles y protección de páginas
    ├── formularios.js        # Validación de campos de formularios
    ├── notificaciones.js     # Mensajes toast de feedback al usuario
    ├── eventos-rutas.js      # Canal de comunicación entre componentes (CustomEvent)
    ├── clima.js               # Consulta la API Open-Meteo + selector de ciudad
    ├── tarjeta-ruta.js        # Web Component <tarjeta-ruta> con Shadow DOM
    ├── inicio-sesion.js       # Lógica del formulario de login
    └── panel.js               # Lógica principal del panel (estado, modales, búsqueda, renderizado)
```

---

## 🚀 Cómo ejecutar

**Opción 1 — Live Server (recomendado):**
1. Abre la carpeta del proyecto en VS Code.
2. Click derecho en `index.html` → **Open with Live Server**.

**Opción 2 — Directo en el navegador:**
1. Abre `index.html` con doble clic.

> No requiere Node.js, npm ni instalación de dependencias.

---

## 🔐 Credenciales de acceso

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `admin` | `admin123` |
| Profesor | `profesor` | `profe456` |

> Las credenciales están definidas en `autenticacion.js` en el arreglo `USUARIOS_DEL_SISTEMA`.

---

## 🚌 Gestión de Rutas (Administrador)

| Acción | Cómo se hace |
|---|---|
| **Crear** | Llenar el formulario "Nueva Ruta" y hacer clic en Agregar Ruta |
| **Editar** | Botón ✏️ en la tarjeta de la ruta — abre un modal con los datos actuales |
| **Eliminar** | Botón 🗑️ en la tarjeta de la ruta — pide confirmación antes de borrar |

Los cambios se guardan automáticamente en LocalStorage y se reflejan al instante en pantalla mediante el sistema de CustomEvent.

---

## 👦 Gestión de Estudiantes (Profesor)

| Acción | Cómo se hace |
|---|---|
| **Agregar** | Botón "+ Agregar estudiante" dentro de la tarjeta de cada ruta |
| **Editar** | Botón ✏️ junto al nombre del estudiante en la lista — abre un modal para corregir el nombre |
| **Eliminar** | Botón ✕ junto al nombre del estudiante — lo quita de la ruta de inmediato |

---

## 🔍 Buscador con resaltado

Tanto el panel del Administrador como el del Profesor incluyen un campo de búsqueda en tiempo real sobre la sección de rutas.

- Busca coincidencias en el **nombre de la ruta**, el **conductor** y los **nombres de los estudiantes**.
- Las coincidencias se resaltan visualmente con fondo amarillo (`<mark>`) dentro de cada tarjeta.
- Si no hay resultados, se muestra un mensaje indicando que no se encontraron coincidencias.
- La búsqueda no distingue mayúsculas ni minúsculas.

---

## 🌍 Selector de ciudad del clima

El clima mostrado en el encabezado ahora es configurable directamente desde la página, sin tocar el código.

- Un selector desplegable junto al ícono del clima permite elegir entre 7 ciudades de Colombia: Girón, Bogotá, Medellín, Cali, Bucaramanga, Cartagena y Barranquilla.
- La ciudad elegida se guarda en LocalStorage (clave `rsk_ciudad_clima`) y se recuerda en la próxima visita.
- Al cambiar de ciudad, el clima se actualiza automáticamente sin recargar la página.
- El selector es responsive: se reubica debajo del encabezado en tablets y reduce su tamaño en móviles pequeños para mantenerse siempre visible y utilizable.

---

## 🌐 API utilizada

| API | Uso | Autenticación |
|---|---|---|
| [Open-Meteo](https://open-meteo.com) | Temperatura y condición climática actual de la ciudad elegida | Sin API key |

Para agregar una nueva ciudad al selector, edita el arreglo `CIUDADES_DISPONIBLES` en `clima.js` con su nombre, latitud y longitud.

---

## 🎓 Conceptos aplicados

| Concepto | Archivo |
|---|---|
| Manipulación dinámica del DOM | `panel.js`, `tarjeta-ruta.js` |
| Validación de formularios | `formularios.js` |
| Asincronía — `fetch` + `async/await` | `clima.js` |
| Web Components + `<template>` + Shadow DOM | `tarjeta-ruta.js` |
| CustomEvent — bus de eventos personalizado | `eventos-rutas.js` |
| LocalStorage — persistencia de datos | `almacenamiento.js`, `clima.js` |
| Control de acceso por roles | `autenticacion.js` |
| Búsqueda y resaltado dinámico | `panel.js`, `tarjeta-ruta.js` |
| Diseño responsive — 3 breakpoints `@media` | `styles.css` |
| Footer fijo al fondo con Flexbox | `styles.css` — `.app`, `.main` |

---

## 📸 Capturas de pantalla

<p align="center">
  <img src="imagenes/inicio_de_sesion_admin.png" width="700" alt="Inicio de sesión Administrador" />
  <br/>
  <em>Pantalla de login con rol Administrador seleccionado</em>
</p>

<p align="center">
  <img src="imagenes/panel_admin.png" width="700" alt="Panel Administrador" />
  <br/>
  <em>Panel de administración — logo de empresa, contadores y formulario de nueva ruta</em>
</p>

<p align="center">
  <img src="imagenes/panel_profe.png" width="700" alt="Panel Profesor" />
  <br/>
  <em>Panel del profesor — visualización de rutas disponibles</em>
</p>

<p align="center">
  <img src="imagenes/tarjeta_con_estudiantes.png" width="700" alt="Tarjeta con estudiantes" />
  <br/>
  <em>Tarjeta de ruta con estudiantes asignados</em>
</p>

---

## 👨‍💻 Autor

**John Faver Calderón Barragán**
Software & Programacion — Campuslands · Girón, Santander, Colombia

[![GitHub](https://img.shields.io/badge/GitHub-Johncalderonb-181717?style=flat&logo=github)](https://github.com/Johncalderonb)
