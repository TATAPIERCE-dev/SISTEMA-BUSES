# Agent Guide

This starter kit keeps agent instructions generic by default.

Use this file as a README for coding agents and as a guide for creating project-specific skills in apps generated from this template.

## Purpose

This repository is a reusable AdonisJS + Inertia + React starter kit. It should stay lightweight and avoid business-specific agent rules.

Do not add project/domain-specific skills directly to the starter unless the starter itself needs them.

## Current stack

- AdonisJS 7
- Inertia.js
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui ready
- Oxlint/Oxfmt with local AdonisJS convention plugins

## Recommended checks

After code changes, agents should usually run:

```bash
npm run lint
npm run typecheck
```

For formatting-sensitive changes:

```bash
npm run format
npm run format:check
```

For build-sensitive changes:

```bash
npm run build
```

## How to add skills in a derived project

When a generated project needs stronger agent guidance, create:

```txt
.agent/
  skills/
    adonis.md
    inertia.md
    frontend-ui.md
    linting.md
    project-conventions.md
```

Then update this `AGENTS.md` in that project to point agents to the relevant files.

Example:

```md
## Project skills

Before editing backend code, read `.agent/skills/adonis.md`.
Before editing frontend code, read `.agent/skills/frontend-ui.md`.
Before changing lint rules, read `.agent/skills/linting.md`.
```

## Suggested skill files

### `.agent/skills/adonis.md`

Use for backend conventions:

- controllers vs actions vs services
- validators with VineJS
- transformers
- error handling
- routing
- jobs or queues if the project uses them

### `.agent/skills/inertia.md`

Use for Inertia/React conventions:

- page structure
- layouts
- typed props
- SSR notes
- route helpers

### `.agent/skills/frontend-ui.md`

Use for UI conventions:

- Tailwind usage
- shadcn/ui component policy
- design tokens
- component organization

### `.agent/skills/linting.md`

Use for quality gates:

- Oxlint/Oxfmt commands
- local rule overrides
- allowed exception markers
- generated files policy

### `.agent/skills/project-conventions.md`

Use for project-specific rules:

- business/domain vocabulary
- feature folder structure
- dependency policy
- commit/build/deploy requirements

## Optional skill sources

For CRM-like projects, you can adapt skills from mature projects such as Antumalal or Sogno. Good candidates to adapt are:

- actions vs services
- error handling
- TypeScript rules
- routing
- transformers

Keep advanced features optional unless the project actually uses them:

- jobs
- realtime/transmit
- JSON column helpers
- pagination serializers

## Starter documentation to read

Agents should inspect the relevant docs before changing related areas:

```txt
docs/shadcn.md
docs/forms-zod-sonner-lucide.md
docs/oxlint-oxfmt.md
```

## General starter rules

- Keep the starter reusable and lightweight.
- Prefer documenting optional stacks instead of installing them by default.
- Do not add heavy feature dependencies unless explicitly requested.
- Do not depend on private packages unless explicitly requested.
- Keep generated/build outputs out of commits unless intentionally versioned.
