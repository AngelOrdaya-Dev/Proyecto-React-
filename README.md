# ⚡ CAMPUS ANGEL - Sistema de Gestión de Matrículas (Fullstack)

¡Bienvenido a **Campus Angel**! Este es mi proyecto integrador, un sistema web Fullstack diseñado para la gestión en tiempo real de alumnos (aspirantes), profesores (mentores), cursos (programas) y el proceso de matrículas VIP. 

La aplicación está construida combinando un frontend interactivo y moderno en **React** con un backend robusto y escalable en **Laravel**, todo conectado a una base de datos relacional **MySQL**.

---

## 🚀 Arquitectura y Tecnologías Utilizadas

El proyecto está dividido en dos repositorios principales que se comunican a través de una API REST:

### 💻 Frontend (Cliente Web)
*   **React 18** (con **Vite** para compilación ultrarrápida).
*   **Diseño Premium UI/UX**: Estética futurista con modo oscuro premium, degradados neón, efectos de *glassmorphism* (diseño translúcido), y micro-animaciones dinámicas.
*   **React Bootstrap** para la base responsiva de la interfaz.
*   **Funcionalidades Clave**:
    *   **Dashboard VIP con Stepper**: Formulario paso a paso interactivo para inscribir alumnos directamente en especialidades de forma fluida.
    *   **Generador de Vouchers**: Creación automática de boletas de matrícula holográficas con código QR integrado y soporte nativo optimizado para impresión física (Ctrl+P).
    *   **Directorio de Alumnos, Mentores y Programas**: Tarjetas interactivas que permiten crear, leer, actualizar (editar) y eliminar (CRUD) datos con sincronización instantánea.
    *   **Toast Alert System**: Sistema de notificaciones flotantes animadas personalizadas para indicar operaciones exitosas o errores.
    *   **Indicador de Estado de la API**: Un sensor en la cabecera que parpadea y te avisa en tiempo real si el servidor backend está en línea (`API: ACTIVA`) o fuera de línea.

### ⚙️ Backend (Servidor API)
*   **Laravel** (PHP).
*   **API RESTful**: Endpoints estructurados para gestionar los recursos principales (`alumnos`, `profesores`, `cursos`, `horarios`, `matriculas`).
*   **Seguridad y Validación**: Reglas estrictas de validación de datos para DNI único, formato de correos, estados y campos obligatorios.
*   **CORS Habilitado**: Configuración para permitir consultas seguras desde servidores externos (incluyendo despliegues en la nube).
*   **Base de Datos**: Relacional en **MySQL** con control total mediante migraciones y seeders para generar datos de prueba al instante.

---

## 🛠️ Estructura del Workspace

*   `Proyecto-React-/`: Contiene todo el código de interfaz, componentes React, hojas de estilo CSS personalizadas y configuración de Vite.
*   `api_escuela/`: Contiene el código fuente de Laravel, controladores de la API, modelos de base de datos Eloquent, y archivos de migración de base de datos.

---

## 📦 Instalación y Configuración Local

Si deseas correr este proyecto en tu computadora local, sigue estos pasos:

### 1. Requisitos Previos
*   Tener instalado **XAMPP** (con Apache y MySQL activos).
*   **Composer** (para dependencias de PHP).
*   **Node.js & npm** (para compilar y ejecutar React).
*   **Git** configurado.

### 2. Configurar el Backend (Laravel)
1.  Abre la terminal en la carpeta `api_escuela/`.
2.  Instala las dependencias de PHP:
    ```bash
    composer install
    ```
3.  Copia el archivo de configuración de entorno:
    ```bash
    cp .env.example .env
    ```
4.  Genera la clave de la aplicación:
    ```bash
    php artisan key:generate
    ```
5.  Abre el archivo `.env` configurado e introduce los accesos a tu base de datos local de XAMPP:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=api_escuela  # Crea esta base de datos en phpMyAdmin
    DB_USERNAME=root
    DB_PASSWORD=
    ```
6.  Corre las migraciones y carga los datos semilla de prueba:
    ```bash
    php artisan migrate:fresh --seed
    ```
7.  Inicia el servidor local de desarrollo:
    ```bash
    php artisan serve
    ```
    *(Por defecto correrá en `http://127.0.0.1:8000`)*

### 3. Configurar el Frontend (React)
1.  Abre otra terminal en la carpeta `Proyecto-React-/`.
2.  Instala los paquetes de Node:
    ```bash
    npm install
    ```
3.  Configura la URL de tu API local. Abre el archivo `src/config.js` y asegúrate de que apunte a tu servidor local de Laravel:
    ```javascript
    export const API_BASE = "http://127.0.0.1:8000/api";
    ```
4.  Arranca la aplicación en tu entorno de desarrollo:
    ```bash
    npm run dev
    ```
5.  ¡Listo! Abre el navegador en la URL que te muestre la terminal (generalmente `http://localhost:5173`).

---

## ☁️ Despliegue en Producción

Este proyecto está configurado y optimizado para funcionar en la nube:

*   **Backend (API & MySQL)**: Desplegado en **Railway** con una base de datos MySQL gestionada en la nube.
    *   **URL de la API**: `https://apiescuela-production.up.railway.app/api`
*   **Frontend**: Desplegado en **Vercel**.
    *   Para conectar el frontend en la nube con la API, se definió la variable de entorno `VITE_API_BASE` en Vercel apuntando a la URL de producción de Railway.

---

## 👤 Autor
*   **Desarrollado por**: Angel Ordaya (AngelOrdaya-Dev)
*   **Objetivo**: Demostrar habilidades en desarrollo Fullstack mediante la integración limpia de interfaces dinámicas reactivas y servicios API estructurados.
