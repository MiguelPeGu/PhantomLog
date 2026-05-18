<div align="center">

# PHANTOMLOG

**Plataforma de investigación paranormal. Gestiona expediciones, foros de evidencias y equipamiento.**

![PHP](https://img.shields.io/badge/PHP-8.5%2B-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

---

## Descripcion

PhantomLog es una aplicación web full-stack de arquitectura desacoplada (**SPA + API REST**). El frontend en React consume una API construida con Laravel 12, con autenticación mediante tokens Bearer (Sanctum) y un panel de administración completo con Filament v5.

### Módulos principales
- **Foros** — Creación de evidencias con sistema de votación y score bar
- **Expediciones** — Gestión y registro de misiones de campo
- **Bestiario** — Catálogo clasificado de entidades paranormales
- **Tienda** — Adquisición de equipamiento con carrito y facturación
- **Panel Admin** — Gestión completa vía Filament (solo administradores)

---

## Requisitos previos

Asegúrate de tener instalado **todo lo siguiente** antes de continuar:

| Herramienta | Versión mínima | Comprobación |
|---|---|---|
| **PHP** | `^8.5.0` | `php -v` |
| **Composer** | `^2.x` | `composer -V` |
| **Bun** (o **Node.js/npm**) | `^1.x` (o Node `^20.x` / npm `^10.x`) | `bun -v` (o `npm -v`) |
| **Git** | cualquier versión reciente | `git -v` |

> **Nota sobre el gestor de paquetes JS:** El proyecto es compatible con **Bun** (recomendado por su extrema velocidad en la descarga de paquetes y compilación) y **npm (Node.js)** indistintamente. Si prefieres no usar Bun, puedes sustituir cualquier comando `bun` de esta guía por su equivalente de `npm` (por ejemplo, usar `npm install` o `npm run dev` en lugar de sus variantes con `bun`).

---

## Instalación completa (paso a paso)

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/MiguelPeGu/PhantomLog.git
cd PhantomLog
```

El repositorio tiene la siguiente estructura de monorepositorio:

```
PhantomLog/
├── phantomlog-backend/    <- API Laravel 12 + Filament
└── phantomlog-frontend/   <- SPA React 19 + Vite
```

---

### Paso 2 — Configurar el Backend

> **Todos los comandos de este paso se ejecutan dentro de la carpeta `phantomlog-backend/`**

```bash
cd phantomlog-backend
```

#### 2.1 — Instalación automatizada con un solo comando

El proyecto incluye un script `composer setup` que hace **todo de forma automática**:

```bash
composer setup
```

Este comando realiza en secuencia:
1. `composer install` — Instala todas las dependencias PHP
2. Copia `.env.example` a `.env` si no existe
3. `php artisan key:generate` — Genera la clave de cifrado de Laravel
4. `php artisan migrate --force` — Crea las tablas en la base de datos SQLite
5. `bun install` — Instala las dependencias del frontend
6. `bun run build` — Compila el bundle de React para producción

> **Si usas npm y no tienes Bun instalado:** Dado que el script `composer setup` ejecuta internamente `bun install` y `bun run build`, fallará si no tienes Bun. En ese caso, realiza la preparación manualmente ejecutando los siguientes comandos:
>
> 1. En la carpeta `phantomlog-backend/` ejecuta:
>    ```bash
>    composer install
>    # Copia el .env si no existe
>    php -r "file_exists('.env') || copy('.env.example', '.env');"
>    php artisan key:generate
>    php artisan migrate --force
>    ```
> 2. En la carpeta `phantomlog-frontend/` ejecuta:
>    ```bash
>    npm install
>    npm run build
>    ```

#### 2.2 — Crear el archivo de base de datos SQLite

El proyecto usa SQLite. El archivo de base de datos **debe existir antes de migrar**. Si `composer setup` falla indicando que no encuentra el archivo SQLite, créalo manualmente:

```bash
# En Linux/macOS:
touch database/database.sqlite

# En Windows (PowerShell):
New-Item -ItemType File database/database.sqlite
```

Luego vuelve a ejecutar las migraciones:

```bash
php artisan migrate --force
```

#### 2.3 — Vincular el almacenamiento público (OBLIGATORIO)

Este paso es **imprescindible** para que las imágenes de perfil, foros y evidencias se muestren correctamente:

```bash
php artisan storage:link
```

> Esto crea un enlace simbólico desde `public/storage` hacia `storage/app/public`, permitiendo que las imágenes subidas por los usuarios sean accesibles desde el navegador.

#### 2.4 — Cargar datos de demostración (Opcional pero recomendado)

Para poblar la base de datos con datos de ejemplo realistas (usuarios, fantasmas, foros, productos, expediciones y facturas):

```bash
php artisan db:seed
```

Esto ejecuta todos los seeders en el orden correcto:
`Users` → `Phantoms` → `Products` → `Forums` → `Expeditions` → `Reports` → `Votes` → `Comments` → `Invoices`

Para empezar de cero y resembrar todo:

```bash
php artisan migrate:fresh --seed
```

#### 2.5 — Configurar las variables de entorno

Abre el archivo `.env` (generado en el paso 2.1) y configura las variables necesarias:

```ini
# URL de la API (no cambiar en desarrollo local)
APP_URL=http://localhost:8000

# URL del frontend React (no cambiar en desarrollo local)
FRONTEND_URL=http://localhost:5173

# Base de datos (SQLite local — no necesita configuración adicional)
DB_CONNECTION=sqlite

# Correo de pruebas con Mailtrap (para notificaciones de facturas)
# Regístrate gratis en https://mailtrap.io y copia tus credenciales aquí
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_usuario_de_mailtrap
MAIL_PASSWORD=tu_contrasena_de_mailtrap
```

---

### Paso 3 — Verificar la instalación del Frontend

> El `composer setup` ya ejecutó `bun install` y `bun run build` en el frontend. Normalmente no necesitas hacer nada más. Si el directorio `phantomlog-frontend/node_modules` no existe, ejecuta:

```bash
cd ../phantomlog-frontend

# Si usas Bun:
bun install

# Si usas npm:
npm install
```

---

### Paso 4 — Arrancar el entorno de desarrollo

El proyecto requiere **dos terminales abiertas en paralelo**.

**Terminal 1 — Backend** (desde `phantomlog-backend/`):

```bash
composer dev
```

Este comando lanza en paralelo dentro de la misma terminal:

| Servicio | URL |
|---|---|
| API Laravel (`php artisan serve`) | `http://localhost:8000` |
| Cola de trabajos (`php artisan queue:listen`) | — |
| Assets Blade/Filament (`bun run dev` o `npm run dev` del backend) | — |

**Terminal 2 — Frontend SPA** (desde `phantomlog-frontend/`):

```bash
# Si usas Bun:
bun run dev

# Si usas npm:
npm run dev
```

Este comando lanza el servidor de desarrollo de Vite con la SPA de React.

Con ambas terminales activas, la aplicación estará disponible en: **[http://localhost:5173](http://localhost:5173)**

> Para detenerlo todo, pulsa `Ctrl + C` en cada terminal.

---

## Estructura del proyecto

```
PhantomLog/
│
├── phantomlog-backend/              <- Backend Laravel 12
│   ├── app/
│   │   ├── Http/Controllers/Api/    <- Controladores REST (Forum, Report, Cart...)
│   │   ├── Http/Middleware/         <- RedirectNonAdminFromFilament
│   │   ├── Models/                  <- Eloquent ORM (User, Forum, Report...)
│   │   ├── Filament/Resources/      <- Panel de administración Filament v5
│   │   ├── Policies/                <- UserPolicy (control acceso admin)
│   │   └── Services/                <- CartService (lógica del carrito en caché)
│   ├── database/
│   │   ├── migrations/              <- Estructura de la base de datos
│   │   ├── seeders/                 <- Datos de demostración
│   │   └── database.sqlite          <- Archivo de base de datos (generado)
│   ├── storage/app/public/          <- Imágenes subidas (vinculado con storage:link)
│   ├── .env.example                 <- Plantilla de configuración
│   └── composer.json                <- Dependencias PHP + scripts de automatización
│
└── phantomlog-frontend/             <- Frontend React 19
    ├── src/
    │   ├── api/                     <- Llamadas HTTP con Axios
    │   ├── components/              <- Layout, PrivateRoute, Loader...
    │   ├── context/                 <- AuthContext, CartContext, DataProvider...
    │   └── pages/                   <- Vistas (Home, Forums, Products...)
    ├── public/                      <- Assets estáticos (imágenes, favicon)
    └── package.json                 <- Dependencias JS
```

---

## Credenciales de prueba (tras ejecutar `db:seed`)

El seeder crea automáticamente los siguientes usuarios:

| Rol | Email | Contraseña |
|---|---|---|
| **Administrador** | `admin@phantomlog.com` | `password` |
| **Usuario normal** | `user@phantomlog.com` | `password` |

> El panel de administración está disponible en **[http://localhost:8000/admin](http://localhost:8000/admin)**. Solo es accesible para usuarios con rol `admin`.

---

## Comandos útiles de referencia

Todos los comandos de Laravel se ejecutan desde **`phantomlog-backend/`**.

### Base de datos

```bash
# Ejecutar migraciones pendientes
php artisan migrate

# Resetear y volver a crear todas las tablas
php artisan migrate:fresh

# Resetear, recrear y poblar con datos de demo
php artisan migrate:fresh --seed

# Ejecutar solo los seeders (sin resetear)
php artisan db:seed
```

### Almacenamiento

```bash
# Crear el enlace simbólico de imágenes (ejecutar una sola vez)
php artisan storage:link

# Limpiar toda la caché de la aplicación
php artisan clear
```

### Exploración de la API

```bash
# Ver todas las rutas registradas de la API
php artisan route:list --path=api
```

### Calidad de código

```bash
# Ejecutar TODA la suite de calidad (tests + lint + tipos)
composer test

# Solo tests unitarios con cobertura
composer test:unit

# Solo cobertura de tipos (exige 100%)
composer test:type-coverage

# Formatear el código con Pint
vendor/bin/pint

# Análisis estático con PHPStan/Larastan
vendor/bin/phpstan
```

### Frontend (desde `phantomlog-frontend/`)

```bash
# Introducir el siguiente comando para iniciar el servidor de desarrollo
bun run dev
```

---

## Resumen de inicio rapido

Lista completa y ordenada de todos los comandos necesarios para poner en marcha PhantomLog desde cero en cualquier sistema operativo.

> Todos los comandos del backend se ejecutan desde `phantomlog-backend/`. El frontend se gestiona desde `composer dev` y no requiere abrir una segunda terminal.

### 1. Clonar el repositorio

```bash
git clone https://github.com/MiguelPeGu/PhantomLog.git
cd PhantomLog
cd phantomlog-backend
```

### 2. Crear el archivo de base de datos SQLite

Este paso es necesario la primera vez si el archivo no existe todavía.

**Linux / macOS:**
```bash
touch database/database.sqlite
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType File database/database.sqlite
```

> En los tres sistemas operativos puedes comprobar que el archivo existe con `ls database/` (Linux/macOS) o `dir database\` (Windows).

### 3. Instalar dependencias y preparar el entorno

```bash
composer setup
```

Este comando es identico en Linux, macOS y Windows. Instala las dependencias PHP y JS, copia el `.env`, genera la clave de la aplicación, ejecuta las migraciones y compila el frontend.

### 4. Vincular el almacenamiento de imágenes

```bash
php artisan storage:link
```

Funciona igual en los tres sistemas operativos. Solo es necesario ejecutarlo una vez.

### 5. Cargar datos de demostración (opcional)

```bash
php artisan db:seed
```

Funciona igual en los tres sistemas operativos.

### 6. Arrancar el entorno de desarrollo

Se necesitan **dos terminales abiertas al mismo tiempo**.

**Terminal 1** — ejecutar desde `phantomlog-backend/`:

```bash
composer dev
```

**Terminal 2** — ejecutar desde `phantomlog-frontend/`:

```bash
# Si usas Bun:
bun run dev

# Si usas npm:
npm run dev
```

Con ambas terminales activas, la aplicación estará disponible en `http://localhost:5173` y la API en `http://localhost:8000`.

Funciona igual en Linux, macOS y Windows.

---

## Seguridad

- La autenticación se gestiona con **Laravel Sanctum** mediante tokens Bearer en cabeceras HTTP.
- El acceso al panel `/admin` está protegido por el middleware `RedirectNonAdminFromFilament` y por la `UserPolicy`, que verifican que el usuario tenga el rol `admin`.
- Las rutas de la API que requieren autenticación están bajo el middleware `auth:sanctum`.

---

## Base de datos

El proyecto usa **SQLite** en desarrollo. El archivo se crea automáticamente en `phantomlog-backend/database/database.sqlite`.

El diseño de las migraciones es agnóstico al motor de base de datos, lo que permite migrar a **MySQL o PostgreSQL en producción** sin modificar ninguna línea de código, simplemente cambiando las variables `DB_*` en el `.env`.

---

## Trabajo realizado por

Miguel Pérez Gutiérrez · 2026
