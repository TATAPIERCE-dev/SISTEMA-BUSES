# Oxlint y Oxfmt

Este starter usa Oxlint y Oxfmt como herramientas rápidas de lint y formato.

## Por qué

- Oxlint es mucho más rápido que ESLint para checks comunes de TypeScript/React.
- Oxfmt permite formateo rápido y consistente.
- Mantiene el starter ágil para uso diario y para hooks de pre-commit o CI.
- Incluye reglas locales de arquitectura inspiradas en los CRM, sin depender del paquete privado `@Airie-dev/adonisjs-oxlint-config`.

## Scripts disponibles

```bash
npm run lint
npm run lint:full
npm run lint:fix
npm run format
npm run format:check
```

También se mantienen fallbacks a las herramientas tradicionales:

```bash
npm run lint:eslint
npm run format:prettier
```

## Archivos de configuración

```txt
oxlint.config.ts
.oxfmtrc.json
tools/oxlint/plugins/adonisjs-no-unsafe-assertions.js
tools/oxlint/plugins/adonisjs-conventions.js
package.json
```

## Plugins locales incluidos

El starter no instala `@Airie-dev/*`. En su lugar, mantiene plugins locales en `tools/oxlint/plugins`.

### `adonisjs-no-unsafe-assertions`

Bloquea assertions inseguras:

```ts
as any
as unknown
<any>
<unknown>
```

En tests esta regla queda desactivada para facilitar mocks.

### `adonisjs-conventions`

Incluye reglas de arquitectura para AdonisJS:

- `require-expected-error-boundary`: los `catch` que no re-lanzan error deben incluir `@expected-error-boundary`.
- `no-controller-model-mutations`: evita mutaciones directas de modelos/db en controllers.
- `no-controller-model-queries`: advierte sobre queries directas en controllers.
- `no-controller-private-methods`: evita helpers privados dentro de controllers.
- `no-controller-top-level-functions`: evita helpers top-level en archivos controller.
- `no-controller-raw-request-input`: evita `request.input()`, `request.all()`, etc. sin `@raw-provider-envelope`.
- `no-controller-to-controller-delegation`: evita importar/construir controllers desde otros controllers.
- `no-unsafe-inertia-prop-casts`: evita casts peligrosos en Inertia/controllers/transformers.
- `require-action-execute-method`: exige `execute()` como método público principal en actions.
- `no-service-domain-action-dependency`: evita que services importen actions.
- `require-structured-error-logging`: exige logs estructurados en `catch`, por ejemplo `{ err: error }`.

## Configuración actual

`oxlint.config.ts` activa:

- plugins nativos: `unicorn`, `typescript`, `oxc`, `react`, `import`
- categorías:
  - `correctness`: error
  - `suspicious`: warning
  - `perf`: warning
- overrides útiles para Adonis/Inertia:
  - `typescript/triple-slash-reference` desactivado en `inertia`, `config`, `ace.js` y `adonisrc.ts`
  - `no-await-in-loop` desactivado en `app`, `database/seeders`, `tests` y `commands`
  - unsafe assertions desactivadas en tests

## Desactivar una regla si molesta

Edita `oxlint.config.ts` y cambia la regla a `off`:

```ts
rules: {
  "adonisjs-conventions/no-controller-model-queries": "off",
}
```

O bájala a warning:

```ts
rules: {
  "adonisjs-conventions/no-controller-model-mutations": "warn",
}
```

## Marcadores permitidos

Algunas reglas permiten excepciones documentadas:

```ts
// @expected-error-boundary
```

Para `catch` que absorben errores de forma intencional.

```ts
// @raw-provider-envelope
```

Para raw request input intencional en controllers.

```ts
// @action-interface
```

Para actions con una interfaz pública más amplia que `execute()`.

## Oxfmt

`.oxfmtrc.json` ignora:

```txt
.adonisjs/**
build/**
coverage/**
node_modules/**
database/schema.ts
```

## Volver a ESLint/Prettier

Si prefieres volver a ESLint y Prettier como default, cambia los scripts principales en `package.json`:

```json
{
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

Puedes mantener Oxlint instalado como herramienta adicional o removerlo:

```bash
npm remove oxlint oxfmt
```
