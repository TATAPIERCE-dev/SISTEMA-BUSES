# TODO

Lista de tareas pendientes para el proyecto.

## 🔴 Prioridad Alta

### Autenticación y Sesiones

- [ ] Configurar conexión Redis para sesiones
- [ ] Implementar sistema de login completo
- [ ] Crear página de registro (signup)
- [ ] Implementar envío de correo de confirmación al registrarse
- [ ] Verificar y probar el uso de sesiones con Redis
- [ ] Implementar logout
- [ ] Agregar recuperación de contraseña

### Base de Datos

- [ ] Crear modelo de usuario completo
- [ ] Agregar migraciones necesarias para usuarios
- [ ] Configurar relaciones de base de datos si es necesario

## 🟡 Prioridad Media

### Frontend - Estilos

- [ ] Implementar Tailwind CSS
- [ ] Configurar shadcn/ui con la siguiente configuración:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "inertia/css/app.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] Crear componentes UI base con shadcn
- [ ] Diseñar layout principal de la aplicación
- [ ] Implementar tema claro/oscuro (opcional)

### Funcionalidades

- [ ] Mejorar validación de formularios
- [ ] Agregar manejo de errores en frontend
- [ ] Implementar notificaciones/toasts
- [ ] Agregar loading states

## 🟢 Prioridad Baja / Mejoras Futuras

- [ ] Agregar tests unitarios
- [ ] Agregar tests de integración
- [ ] Mejorar documentación del código
- [ ] Optimizar rendimiento
- [ ] Agregar CI/CD
- [ ] Configurar Docker para desarrollo
- [ ] Agregar logging avanzado

## 📝 Notas

- El proyecto ya tiene la estructura base de autenticación
- Los controladores de sesión y cuenta nueva ya están creados
- Falta conectar Redis y completar la implementación
