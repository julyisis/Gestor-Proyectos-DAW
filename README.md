#  GestorPro - Sistema de Gestión de Proyectos

¡Bienvenido a **GestorPro**! Un sistema robusto, limpio y minimalista diseñado para optimizar la gestión de proyectos, clientes y tareas en entornos corporativos. Este desarrollo simula una solución profesional para una consultora tecnológica, priorizando la simplicidad de la interfaz de usuario y la robustez en la arquitectura del sistema.

---

## 🛠️ Stack Tecnológico

El ecosistema de la aplicación está construido con tecnologías modernas y de alta demanda en el mercado:

* **Frontend:** Angular (Estructura modular y UI limpia con componentes dinámicos).
* **Backend:** NestJS (Arquitectura escalable basada en TypeScript).
* **Base de Datos:** PostgreSQL (Relacional, robusta y optimizada con TypeORM).
* **Servidor Web y Proxy:** Nginx (Manejo de rutas de producción y seguridad).
* **Gestión de Procesos:** PM2 (Para mantener el backend activo en segundo plano).

---

##  Mis Aportes al Proyecto (DevOps & Seguridad)

Además de participar en el diseño general del sistema y las reglas de negocio, me encargué de la infraestructura local, el despliegue con PM2 y el blindaje del servidor mediante **Nginx**, implementando:

1.  **Cabeceras de Seguridad Estrictas:** Inyección de políticas HTTP para mitigar ataques comunes en la web:
    * `X-Frame-Options: SAMEORIGIN` (Protección contra Clickjacking).
    * `X-Content-Type-Options: nosniff` (Mitigación de ataques basados en MIME-sniffing).
    * `X-XSS-Protection: 1; mode=block` (Filtro activo contra Cross-Site Scripting).
2.  **Soporte HTTPS Local:** Configuración de certificados SSL (`.pem`) para asegurar que el tráfico local viaje encriptado.
3.  **Reverse Proxy Eficiente:** Configuración de Nginx para redirigir el tráfico del Frontend y del Backend (`/api/`) de forma transparente en el puerto `80`.

---

## ✨ Funcionalidades Destacadas del Equipo

* **Acceso Restringido:** Sistema de login seguro con validación de estado de usuario (Activo/Baja).
* **Gestión de Clientes con Reglas de Negocio Estrictas:** Bloqueo automático de baja si el cliente posee proyectos activos asociados.
* **Proyectos Flexibles:** Soporte tanto para clientes externos (activos) como para proyectos internos de la empresa.
* **Tablero Kanban Interactivo:** Flujo dinámico para la creación, modificación y cambio de estado de tareas (Pendiente, Finalizado, Baja).
* **Exportación de Datos:** Botón nativo para la descarga de reportes de proyectos en formato **CSV**.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

### Requisitos Previos
* Node.js & npm instalados.
* PostgreSQL corriendo localmente con las credenciales configuradas en el entorno.
* Nginx instalado en el sistema.

### Pasos
1.  **Clonar el repositorio:**
```bash
    git clone [https://github.com/julyisis/Gestor-Proyectos-DAW.git](https://github.com/julyisis/Gestor-Proyectos-DAW.git)
    ```
2.  **Levantar el Backend (NestJS):**
```bash
    cd backend
    npm install
    pm2 start dist/main.js --name "backend-api"
    ```
3.  **Iniciar Nginx:**
    Asegurarse de que el archivo `nginx.conf` apunte correctamente al `dist` del frontend y ejecutar el servicio de Nginx.
4.  **Acceder a la app:**
    Abrir el navegador en `http://localhost`.
