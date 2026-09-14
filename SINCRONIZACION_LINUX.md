# 🐧 Guía de Sincronización y Contexto para Antigravity (Linux Laptop)

> **Destinatario**: Agente Antigravity en la Laptop con **Linux (EndeavourOS / Arch Linux)**  
> **Usuario**: Fernando Daniel Tolentino Uribe (`ferchoesty-max` / `ferchoesty@gmail.com`)  
> **Materia**: Cómputo en la Nube — Universidad de Guanajuato (DICIS)  
> **Proyecto Activo**: `ParkingFlow`  
> **Ruta en Linux**: `/home/fernando/Documents/UniversidadMega/Materias/Computo_en_la_Nube/ParkingFlow`

---

## 📌 Contexto de la Arquitectura Dual (Windows 💻 ⟷ Linux 🐧)

1. El usuario trabaja alternando entre su PC de escritorio con **Windows** y esta Laptop con **Linux**.
2. **MegaSync**: Sincroniza los archivos físicos en tiempo real entre ambas máquinas. Por lo tanto, **es muy probable que los archivos nuevos creados en Windows ya estén físicamente en tu disco duro**.
3. **GitHub**: Es la fuente de verdad del control de versiones (`origin/feature/dashboard`).
4. **El Reto**: Como MegaSync sincroniza archivos físicos pero **no** gestiona el historial de Git, al abrir el proyecto en Linux puede ocurrir que:
   - Hay archivos nuevos o modificados en el disco que aparecen como `Untracked` o `Modified`.
   - La rama local de Git en Linux aún no tiene los últimos commits de GitHub.

---

## 🛠️ Protocolo Obligatorio de Inicio en Linux

Cuando el usuario te pida continuar con el trabajo o retomar el proyecto en Linux, ejecuta los siguientes pasos:

### Paso 1: Ubicación y Diagnóstico Inicial
```bash
cd /home/fernando/Documents/UniversidadMega/Materias/Computo_en_la_Nube/ParkingFlow
git status
git branch -vv
git fetch origin
```

### Paso 2: Asegurar la Rama de Trabajo
La rama activa de desarrollo es **`feature/dashboard`**.
```bash
git checkout feature/dashboard
```

### Paso 3: Sincronizar con GitHub
Si en Windows se realizó `git push origin feature/dashboard`, trae los cambios remotos:
```bash
git pull origin feature/dashboard
```
> **Nota sobre posibles advertencias**:  
> Si MegaSync ya había descargado los archivos idénticos y Git advierte sobre archivos que serían sobrescritos, verifica con `git status`. Si los archivos locales son los mismos que vienen del commit de Windows, puedes agregarlos al commit o hacer un `git stash` temporal antes de hacer `pull`.

### Paso 4: Validar la Compilación y Tipado
Asegúrate de que el proyecto compile sin errores en el entorno Linux:
```bash
# Validar TypeScript en el Frontend
npx tsc --noEmit -p apps/web/tsconfig.json

# Validar TypeScript en el Backend
npx tsc --noEmit -p apps/api/tsconfig.json
```
Ambos deben responder con **0 errores**.

---

## 📋 Resumen del Estado Actual del Proyecto (Lo que se hizo en Windows)

1. **Monorepo Estructurado**:
   - `apps/web`: Aplicación Nuxt 3/4 + Tailwind CSS v4 + TypeScript.
   - `apps/api`: Servidor Express 5 + TypeScript + Zod + dotenv.
2. **Dashboard de Estacionamiento (`apps/web`)**:
   - Componentes creados: `ParkingGrid.vue`, `ParkingSpaceCard.vue`, `ParkingSummary.vue`, `BaseBadge.vue`.
   - Página interactiva: `apps/web/app/pages/index.vue` (permite alternar estados de cajones en tiempo real).
   - Mock reactivo: `apps/web/app/composables/useParkingMock.ts` con tipos en `apps/web/app/types/parking.ts`.
3. **Nuevo Composable de API**:
   - Creado en `apps/web/app/composables/useApi.ts` configurado con `$fetch` y `runtimeConfig.public.apiBaseUrl`.
4. **Solución a Error de Tipos TS2321 en `apps/web/nuxt.config.ts`**:
   - Tailwind v4 requiere casteo `tailwindcss() as any` dentro de `vite.plugins` para evitar la recursión infinita de tipos de Rollup en Nuxt.
5. **Estilos Globales**:
   - `apps/web/app/assets/css/main.css` tiene configurada la fuente `Inter, ui-sans-serif` y fondo limpio para `body`.
6. **Variables de Entorno**:
   - `apps/.env.example`
   - `apps/api/.env.example` y `apps/api/.env` (puerto `3001` y `CORS_ORIGIN=http://localhost:3000`)
   - `apps/web/.env.example` (`NUXT_PUBLIC_API_BASE_URL=http://localhost:3001`)
7. **Limpieza**:
   - Se eliminaron carpetas externas y código duplicado defectuoso (`parking-flow` y `apps-web-app`).

---

## 🎯 Siguientes Tareas Pendientes (Para continuar en Linux)

1. **Backend (`apps/api`)**:
   - Crear el punto de entrada del servidor Express: `apps/api/src/server.ts` (o `app.ts`).
   - Configurar middlewares (CORS, JSON parser).
   - Implementar las rutas y controladores para cajones de estacionamiento (`/api/v1/parking-spaces`).
2. **Conexión Frontend - Backend**:
   - Conectar `apps/web` para consumir los endpoints reales a través de `useApi()`.
   - Manejar estados de carga (`pending`), error y actualización de estado de cajones vía HTTP `PATCH` o `PUT`.
