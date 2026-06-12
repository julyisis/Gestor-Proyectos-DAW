# Cómo levantar el proyecto

Guía paso a paso para correr el gestor de proyectos en tu PC (Windows).

Hay **dos formas** de usarlo:

| Modo | Para qué sirve | URLs |
|------|----------------|------|
| **Desarrollo** | Programar y probar rápido | Frontend `:4200`, API `:3000` |
| **Producción** | Entrega / demo con nginx + PM2 | Todo en `http://localhost` |

---

## 1. Qué necesitás tener instalado

| Programa | Para qué | Cómo verificar |
|----------|----------|----------------|
| **Node.js** (v18+) | Backend y frontend | `node -v` |
| **npm** | Dependencias | `npm -v` |
| **PostgreSQL** | Base de datos | `psql --version` |
| **PM2** | Mantener el backend vivo | `pm2 -v` |
| **nginx** | Servir frontend y proxy API | `nginx -v` |

Si falta alguno:

```powershell
# Node: descargar de https://nodejs.org
# PostgreSQL: https://www.postgresql.org/download/windows/
npm install -g pm2
# nginx: ya lo tenés instalado en la PC
```

---

## 2. Descargar el proyecto

Cloná o descomprimí el repo y entrá a la carpeta:

```powershell
cd C:\ruta\donde\guardaste\final-daw
```

> En los pasos siguientes, todos los comandos asumen que estás **dentro de `final-daw`**.

---

## 3. Base de datos

Importá el backup en PostgreSQL (usuario `postgres`, base `daw`):

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "DROP DATABASE IF EXISTS daw;"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE daw OWNER postgres ENCODING 'UTF8';"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d daw -f "base_datos_final.sql"
```

Si tu PostgreSQL está en otra versión, cambiá el `18` por la que tengas (por ejemplo `16`).

**Usuarios de prueba:**

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `juli_admin` | `123` | admin |
| `juli_gutierrez` | `Admin1234` | admin |

---

## 4. Modo desarrollo (rápido)

### Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run start:dev
```

Dejá esa terminal abierta. La API queda en `http://localhost:3000/api/v1`.

### Frontend (otra terminal)

```powershell
cd frontend
npm install
npm start
```

Abrí `http://localhost:4200` e iniciá sesión con `juli_admin` / `123`.

---

## 5. Probar en local con nginx

Este modo simula la entrega real: todo entra por **`http://localhost`** (puerto 80).

### Qué hace `nginx/nginx.conf`

El archivo del repo es un bloque `server` con dos reglas:

| Ruta | Qué hace |
|------|----------|
| `/` | Sirve el frontend compilado (`frontend/dist/frontend/browser`) |
| `/api/` | Reenvía al backend NestJS en `http://localhost:3000/api/` |

La ruta del frontend es **relativa al proyecto** (`frontend/dist/frontend/browser`). No hace falta editarla si arrancás nginx con `-p` apuntando a la carpeta `final-daw`.

### 5.1 Backend

```powershell
cd backend
copy .env.example .env
npm install
npm run build
npm run start:pm2
```

Verificar:

```powershell
pm2 status
```

La API tiene que estar en `http://localhost:3000/api/v1`.

Scripts PM2 disponibles en `backend/package.json`:

| Comando | Qué hace |
|---------|----------|
| `npm run start:pm2` | Levanta la API con PM2 |
| `npm run stop:pm2` | Detiene la API |
| `npm run restart:pm2` | Reinicia la API (útil tras `npm run build`) |

### 5.2 Build del frontend

```powershell
cd frontend
npm install
npm run build
```

Tiene que existir la carpeta `frontend/dist/frontend/browser` con un `index.html` adentro.

### 5.3 Conectar nginx con la config del proyecto

Como `nginx/nginx.conf` es solo el bloque `server`, hay que **incluirlo** en el nginx que ya tenés instalado.

1. Abrí el config principal de nginx (ejemplo: `C:\nginx\conf\nginx.conf`).
2. Dentro del bloque `http { ... }`, agregá **una línea** (con la ruta de tu clone):

```nginx
include C:/ruta/a/final-daw/nginx/nginx.conf;
```

3. Guardá el archivo.

> Cada persona cambia solo esa ruta del `include`. El archivo del repo no se toca.

### 5.4 Arrancar nginx

Desde PowerShell, parate en la carpeta del proyecto y arrancá nginx indicando esa carpeta como raíz (`-p`):

```powershell
cd C:\ruta\a\final-daw
```

Si `nginx` no está en el PATH:

```powershell
& "C:\nginx\nginx.exe" -p $PWD -c C:\nginx\conf\nginx.conf
```

Ajustá `C:\nginx\conf\nginx.conf` y `C:\nginx\nginx.exe` según tu instalación.

**Por qué el `-p $PWD`:** le dice a nginx que la ruta `frontend/dist/frontend/browser` se resuelva dentro del repo, sin poner la ruta absoluta de tu PC en el archivo.

### 5.5 Probar en el navegador

| Qué | URL |
|-----|-----|
| Frontend | http://localhost |
| API | http://localhost/api/v1 |
| Swagger | http://localhost/api |

Login: `juli_admin` / `123`

Si cambiás el frontend, volvé a hacer `npm run build` en `frontend` y recargá la página (Ctrl+F5).

### 5.6 Recargar o detener nginx

Después de editar la config:

```powershell
nginx -s reload -p $PWD -c C:\nginx\conf\nginx.conf
```

Para detener:

```powershell
nginx -s stop -p $PWD -c C:\nginx\conf\nginx.conf
cd backend
npm run stop:pm2
```

---

## 6. Detener todo (desarrollo)

Cerrá las terminales de `npm run start:dev` y `npm start`, o usá Ctrl+C.

---

## 7. Detener todo (nginx + PM2)

```powershell
cd backend
npm run stop:pm2
nginx -s stop -p $PWD -c C:\nginx\conf\nginx.conf
```

---

## 8. Sobre la ruta en nginx

**¿Hace falta poner la ruta fija de tu PC en `nginx/nginx.conf`?** No.

El archivo usa:

```
root frontend/dist/frontend/browser;
```

Esa ruta es relativa. Funciona cuando nginx arranca con:

```
nginx -p RUTA_AL_PROYECTO -c C:\nginx\conf\nginx.conf
```

Lo único que cada uno personaliza es la línea `include` en su nginx principal, apuntando a donde clonó el repo.

---

## 9. Problemas frecuentes

| Problema | Solución |
|----------|----------|
| Puerto 3000 ocupado | `cd backend` → `npm run stop:pm2` o cerrar otro backend |
| Puerto 80 ocupado | Otro nginx/IIS corriendo; detenerlo o cambiar `listen 80` |
| Login falla tras importar SQL | Las contraseñas quedaron en texto plano; hay que hashearlas de nuevo |
| nginx: error al arrancar | `nginx/nginx.conf` es un bloque `server`; hay que incluirlo en el `nginx.conf` principal |
| nginx: página en blanco | Ejecutar `npm run build` en frontend antes de levantar nginx |
| API no responde en localhost | `pm2 status` o `cd backend` → `npm run restart:pm2` |
| Bruno no funciona | Elegir entorno **`local`** y ejecutar **`login`** primero |

---

## 10. Colección Bruno (opcional)

1. Abrí la carpeta `TP_Final_Daw` en Bruno.
2. Seleccioná el entorno **`local`**.
3. Ejecutá **`login`** (guarda el token).
4. Ejecutá el resto de los requests.
