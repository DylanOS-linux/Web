# DylanOS Website

[![Sitio web](https://img.shields.io/badge/sitio-dylanoswebsite.vercel.app-8A2BE2)](https://dylanoswebsite.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)

Sitio web oficial de **DylanOS**, una distribución Linux moderna, ligera y personalizable.

Incluye el catálogo de descargas de DylanOS Crimson, información del proyecto, documentación, presentación del equipo, panel de administración, asistente basado en IA y herramientas de publicación de versiones.

## Características

- Catálogo público de versiones e imágenes de DylanOS.
- Descargas alojadas en SourceForge.
- Panel de administración para gestionar publicaciones.
- CLI local para publicar, retirar y consultar versiones.
- Asistente conversacional basado en IA.
- Estadísticas públicas del repositorio de DylanOS.
- Diseño adaptable para escritorio y dispositivos móviles.
- Integración preparada para Supabase y despliegue en Vercel.

## Tecnologías

- HTML5, CSS3 y JavaScript
- Node.js 20+
- Supabase y PL/pgSQL
- SourceForge FRS
- Vercel
- Playwright Core

## Instalación local

### Requisitos

- Node.js 20 o superior
- npm

### Pasos

```bash
git clone https://github.com/dylanneymarmontalvo2014-lgtm/DylanOS-Website.git
cd DylanOS-Website
npm install
```

Crea el archivo de configuración local:

```bash
cp .env.example .env.local
```

Completa las variables necesarias en `.env.local` y inicia el servidor:

```bash
npm run dev
```

La web estará disponible en `http://127.0.0.1:5502`.

## Variables de entorno

Consulta `.env.example` para ver la configuración completa.

### Supabase y publicaciones

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SOURCEFORGE_PROJECT=
SOURCEFORGE_USERNAME=
SOURCEFORGE_SSH_HOST=frs.sourceforge.net
```

La clave `SUPABASE_SERVICE_ROLE_KEY` y cualquier credencial SSH deben mantenerse privadas y nunca deben exponerse al navegador.

### Estadísticas de GitHub

```env
GITHUB_OWNER=dylanneymarmontalvo2014-lgtm
GITHUB_REPO=DylanOS
GITHUB_TOKEN=
```

El token es opcional y solo se necesita si deseas aumentar el límite de solicitudes a la API de GitHub.

## Comandos disponibles

```bash
npm run dev                 # Inicia el servidor local
npm test                    # Ejecuta las pruebas
npm run releases:status     # Muestra el estado de las publicaciones
npm run releases:list       # Lista las versiones
npm run releases:history    # Consulta el historial de publicaciones
npm run releases:publish    # Publica una nueva versión
npm run releases:retire     # Retira una versión
npm run releases:delete     # Elimina una publicación
npm run releases:cleanup    # Limpia publicaciones antiguas
npm run releases:verify     # Verifica las publicaciones
npm run releases:admin:add   # Añade un administrador
```

## Estructura del proyecto

```text
.
├── api/                 # Endpoints y servicios del sitio
├── admin/               # Panel de administración
├── asistente ai/        # Configuración y widget del asistente
├── docs/                # Contenido de documentación
├── DylanOSdocs/         # Documentación adicional de DylanOS
├── images/              # Recursos gráficos
├── lib/                 # Utilidades compartidas
├── scripts/             # Scripts del navegador y automatización
├── styles/              # Hojas de estilo
├── supabase/            # Migraciones y configuración de base de datos
├── tests/               # Pruebas automatizadas
├── tools/releases/      # CLI de gestión de versiones
├── index.html           # Página principal
├── server.js            # Servidor Node.js y rutas API
└── vercel.json          # Configuración de Vercel
```

## Despliegue

El proyecto puede desplegarse en Vercel. Configura las variables de entorno requeridas desde **Project Settings → Environment Variables** antes de publicar.

Después del despliegue, `server.js` sirve la web y las rutas bajo `api/` funcionan como funciones serverless según la configuración de `vercel.json`.

## Sitio en producción

https://dylanoswebsite.vercel.app

## Contribuir

Las contribuciones son bienvenidas.

1. Haz un fork del repositorio.
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza tus cambios y ejecuta `npm test`.
4. Envía un pull request describiendo claramente la propuesta.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` si está disponible en el repositorio.
