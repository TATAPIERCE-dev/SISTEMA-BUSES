# Formularios, validación, toasts e iconos

Este starter no instala por defecto todas las dependencias de formularios/UI para mantenerse liviano. Instálalas cuando el proyecto las necesite.

> Nota: `sonner` ya viene instalado en este starter. El comando completo se deja como referencia para proyectos nuevos o si decides reinstalar el stack completo.

## Instalación recomendada

```bash
npm install react-hook-form zod @hookform/resolvers sonner lucide-react
```

## React Hook Form + Zod

Ejemplo básico:

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("email")} />
      <input type="password" {...form.register("password")} />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

## Sonner

Instala el toaster una vez en tu layout principal:

```tsx
import { Toaster } from "sonner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
```

Uso:

```tsx
import { toast } from "sonner";

toast.success("Guardado correctamente");
toast.error("No se pudo guardar");
```

## Lucide React

```tsx
import { Search } from "lucide-react";

export function SearchIcon() {
  return <Search className="size-4" />;
}
```

## Recomendación

- Usa `react-hook-form` para formularios con estado y validación cliente.
- Usa `zod` para validar datos en frontend cuando necesites feedback inmediato.
- Mantén VineJS en backend como fuente real de validación del servidor.
- Usa `sonner` para feedback rápido al usuario.
- Usa `lucide-react` para iconografía consistente con shadcn/ui.
