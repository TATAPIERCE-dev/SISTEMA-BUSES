# React Starter Kit

Starter kit personal basado en [AdonisJS Inertia Starter Kit](https://github.com/adonisjs/react-starter-kit), adaptado para crear aplicaciones AdonisJS + Inertia + React con una base moderna, tipada y preparada para UI escalable.

## 🚀 Tecnologías

### Backend

- **AdonisJS 7.x** - Framework Node.js con TypeScript
- **Lucid ORM** - ORM para base de datos
- **VineJS** - Validación de datos en backend
- **Inertia.js** - Aplicaciones SPA server-driven sin API REST obligatoria
- **PostgreSQL** - Base de datos principal
- **Redis** - Sesiones/cache según configuración del proyecto

### Frontend

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Inertia.js React** - Integración React con Inertia
- **Tailwind CSS v4** - Framework CSS utility-first configurado
- **shadcn/ui ready** - `components.json`, aliases y utilidad `cn()` listos para instalar componentes cuando se necesiten

### Herramientas de desarrollo

- **Oxlint** - Linter rápido para TypeScript/React
- **Oxfmt** - Formateador rápido
- **ESLint/Prettier** - Disponibles como fallback opcional
- **Docker Compose** - Servicios de desarrollo incluidos en `compose.yml`

## 📋 Características

- ✅ Autenticación con sesiones
- ✅ Sistema de usuarios
- ✅ Validación de formularios con VineJS
- ✅ Protección CSRF
- ✅ Inertia + React con SSR configurado
- ✅ HMR con Vite
- ✅ TypeScript en backend y frontend
- ✅ Tailwind CSS v4 listo para usar
- ✅ Preparado para instalar shadcn/ui en el futuro
- ✅ `components.json` configurado
- ✅ Utilidad `cn()` en `inertia/lib/utils.ts`
- ✅ Reglas locales de Oxlint para convenciones AdonisJS
- ✅ Estructura de proyecto escalable

## 🛠️ Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/VixoPlank/react-starter-kit.git
cd react-starter-kit
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

4. Generar la clave de la aplicación:

```bash
node ace generate:key
```

5. Configurar la base de datos en `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=nombre_base_datos
```

6. Ejecutar migraciones:

```bash
node ace migration:run
```

## 🚦 Uso

### Desarrollo

```bash
npm run dev
```

Esto iniciará:

- Servidor AdonisJS en `http://localhost:3333`
- Vite dev server con HMR

### Producción

```bash
npm run build
npm start
```

### Scripts disponibles

```bash
# Ejecutar tests
npm test

# Lint rápido con Oxlint
npm run lint

# Lint completo
npm run lint:full

# Fix automático de lint cuando aplique
npm run lint:fix

# Formatear con Oxfmt
npm run format

# Revisar formato
npm run format:check

# Type checking backend + frontend
npm run typecheck

# Fallbacks opcionales
npm run lint:eslint
npm run format:prettier
```

## 🎨 Tailwind CSS y shadcn/ui

Tailwind CSS v4 ya está instalado y configurado en:

```txt
inertia/css/app.css
vite.config.ts
```

El proyecto está preparado para shadcn/ui, pero no trae componentes instalados por defecto para mantener el starter liviano.

Archivos/carpetas relevantes:

```txt
components.json
inertia/components
inertia/components/ui
inertia/hooks
inertia/lib/utils.ts
```

Para instalar componentes shadcn/ui más adelante:

```bash
npx shadcn@latest add button input card dialog dropdown-menu form
```

Más detalles en [docs/shadcn.md](./docs/shadcn.md).

## 🧹 Oxlint/Oxfmt

Este starter usa Oxlint/Oxfmt como tooling principal.

Además incluye plugins locales de convenciones AdonisJS en:

```txt
tools/oxlint/plugins/adonisjs-no-unsafe-assertions.js
tools/oxlint/plugins/adonisjs-conventions.js
```

Estos plugins están vendorizados dentro del starter para no depender del paquete privado `@Airie-dev/adonisjs-oxlint-config`.

Incluyen reglas para:

- evitar `as any` / `as unknown`
- mantener controllers delgados
- evitar raw request input sin marcador explícito
- exigir `execute()` en actions
- evitar casts inseguros en Inertia/controllers/transformers
- exigir logging estructurado en `catch`

Más detalles en [docs/oxlint-oxfmt.md](./docs/oxlint-oxfmt.md).

## 📚 Documentación adicional

```txt
docs/shadcn.md                  # Cómo instalar y usar shadcn/ui
docs/forms-zod-sonner-lucide.md # Guía opcional para RHF, Zod, Sonner y Lucide
docs/oxlint-oxfmt.md            # Configuración de Oxlint/Oxfmt y reglas locales
docs/TODO.md                    # Tareas pendientes
```

## 📁 Estructura del proyecto

```txt
react-starter-kit/
├── app/                    # Lógica backend
│   ├── controllers/        # Controladores
│   ├── models/             # Modelos Lucid
│   ├── middleware/         # Middleware personalizado
│   ├── validators/         # Validadores VineJS
│   └── transformers/       # Transformadores de datos
├── config/                 # Configuración AdonisJS
├── database/               # Migraciones y schema
├── docs/                   # Documentación del starter
├── inertia/                # Frontend React/Inertia
│   ├── app/                # Entrada cliente
│   ├── components/         # Componentes React
│   │   └── ui/             # Destino para componentes shadcn/ui
│   ├── css/                # Tailwind CSS v4 y tokens
│   ├── hooks/              # Hooks frontend
│   ├── layouts/            # Layouts Inertia
│   ├── lib/                # Utilidades frontend
│   └── pages/              # Páginas Inertia
├── resources/              # Views Edge y recursos
├── start/                  # Bootstrap/rutas/kernel
└── tools/                  # Herramientas locales del starter
    └── oxlint/plugins/     # Plugins Oxlint locales
```

## 🔐 Autenticación

El proyecto incluye:

- Login y registro de usuarios
- Middleware de autenticación
- Protección de rutas
- Gestión de sesiones

## 📄 Licencia

Este es un proyecto personal. Basado en el [AdonisJS Inertia Starter Kit](https://github.com/adonisjs/react-starter-kit) (licencia MIT).

## 🤝 Contribuciones

Este es un proyecto personal, pero las sugerencias son bienvenidas.

---

Hecho con ❤️ usando AdonisJS, Inertia y React.
