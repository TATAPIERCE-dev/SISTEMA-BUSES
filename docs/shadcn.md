# shadcn/ui

Este starter ya queda preparado para instalar componentes de shadcn/ui en el futuro, pero no trae componentes instalados por defecto para mantenerse liviano.

## Qué ya está configurado

- Tailwind CSS v4 en `inertia/css/app.css`.
- Plugin de Tailwind para Vite en `vite.config.ts`.
- Alias `@` apuntando a `inertia`.
- Archivo `components.json` con estilo `new-york`.
- Utilidad `cn()` en `inertia/lib/utils.ts`.
- Carpetas base:
  - `inertia/components`
  - `inertia/components/ui`
  - `inertia/hooks`
  - `inertia/lib`

## Instalar componentes

Ejemplo recomendado para comenzar:

```bash
npx shadcn@latest add button input label card dialog dropdown-menu form
```

Los componentes se crearán en:

```txt
inertia/components/ui
```

## Alias disponibles

```ts
@/components
@/components/ui
@/lib
@/hooks
```

Ejemplo:

```tsx
import { cn } from "@/lib/utils";
// después de instalar button:
// import { Button } from '@/components/ui/button'
```

## Notas

- No hace falta crear `tailwind.config.js`; Tailwind v4 usa configuración CSS-first.
- Si shadcn agrega dependencias como Radix UI, quedarán en `package.json` al ejecutar el comando `add`.
- Mantén `components.json` sincronizado si cambias los aliases del proyecto.
