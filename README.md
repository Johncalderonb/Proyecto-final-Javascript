# 🚌 Rutas Seguras Kids

> Sistema frontend de gestión de transporte escolar con autenticación por roles y persistencia en LocalStorage.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Sin frameworks](https://img.shields.io/badge/Vanilla_JS-sin_frameworks-orange?style=flat)

---

## 📋 Descripción

**Rutas Seguras Kids** es una aplicación web desarrollada con HTML, CSS y JavaScript puro (Vanilla JS), sin librerías ni frameworks externos. Permite a una empresa de transporte escolar gestionar rutas, conductores y estudiantes a través de dos roles con acceso diferenciado.

| Rol | Acceso |
|---|---|
| 🛡️ **Administrador** | Crear, editar y eliminar rutas; asignar conductores y horarios |
| 👨‍🏫 **Profesor** | Consultar rutas activas y asignar estudiantes a cada bus |

---

## ✨ Características

- 🔐 Login con selección de rol y verificación de credenciales
- 💾 Persistencia de datos en **LocalStorage** (las rutas se mantienen al recargar)
- 🚌 CRUD completo de rutas: crear, editar y eliminar
- 👦 Asignación y eliminación de estudiantes por ruta
- 🌤️ Clima en tiempo real con la API pública **Open-Meteo** (sin API key)
- 🧩 Web Component `<tarjeta-ruta>` con `<template>` y **Shadow DOM**
- 📡 Comunicación entre componentes mediante **CustomEvent**
- 📱 Diseño responsive con 3 breakpoints (900px / 600px / 380px)
- 🔔 Notificaciones toast de feedback al usuario

---

## 🗂️ Estructura del proyecto

```
rutas-seguras-kids/
│
├── index.html                    # Página de inicio de sesión
├── README.md
├── .gitignore
│
├── paginas/
│   └── panel.html                # Panel principal (solo accesible con sesión activa)
│
├── assets/
│   └── imagenes/                 # Logo e imágenes de la empresa
│
├── docs/                         # Capturas de pantalla y documentación adicional
│
└── src/
    ├── css/
    │   └── estilos.css           # Estilos completos del proyecto
    │
    └── js/
        ├── almacenamiento.js     # Lee y guarda datos en LocalStorage
        ├── autenticacion.js      # Usuarios, roles y protección de páginas
        ├── formularios.js        # Validación de campos de formularios
        ├── notificaciones.js     # Mensajes toast de feedback al usuario
        ├── eventos-rutas.js      # Canal de comunicación entre componentes (CustomEvent)
        ├── clima.js              # Consulta la API de clima Open-Meteo
        ├── tarjeta-ruta.js       # Web Component <tarjeta-ruta> con Shadow DOM
        ├── inicio-sesion.js      # Lógica del formulario de login
        └── panel.js              # Lógica principal del panel de gestión
```

---

## 🚀 Cómo ejecutar

**Opción 1 — Live Server (recomendado):**
1. Abre la carpeta del proyecto en VS Code.
2. Click derecho en `index.html` → **Open with Live Server**.

**Opción 2 — Directo en el navegador:**
1. Abre el archivo `index.html`.

> No requiere Node.js ni instalación de dependencias.

---

## 🔐 Credenciales de acceso

| Rol | Usuario | Contraseña |
|---|---|---|
| Administrador | `admin` | `admin123` |
| Profesor | `profesor` | `profe456` |

---

## 🌐 API utilizada

| API | Uso | Autenticación |
|---|---|---|
| [Open-Meteo](https://open-meteo.com) | Clima actual | Sin API key |

---

## 🎓 Conceptos aplicados

| Concepto | Dónde se aplica |
|---|---|
| Manipulación del DOM | `panel.js` — renderizado dinámico de tarjetas |
| Validación de formularios | `formularios.js` — usado en login y panel |
| Asincronía (fetch + async/await) | `clima.js` |
| Web Components + Shadow DOM | `tarjeta-ruta.js` |
| CustomEvent (eventos personalizados) | `eventos-rutas.js` |
| LocalStorage | `almacenamiento.js` |
| Control de acceso por roles | `autenticacion.js` |
| Diseño responsive | `estilos.css` — 3 breakpoints |

---

## 👨‍💻 Autor

**John Faver Calderón Barragán**
Software & AI Programming — Campuslands, Girón, Santander, Colombia

[![GitHub](https://img.shields.io/badge/GitHub-JohnFaverCB-181717?style=flat&logo=github)](https://github.com/JohnFaverCB)
