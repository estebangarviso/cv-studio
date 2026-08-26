# CV Studio

> Next.js 16 App Router — feature modules, type-safe API client, TanStack Query + Zustand, react-hook-form + Zod, Tailwind CSS v4.

A lean, functional, enterprise-grade frontend starter. It talks to an OpenAPI 3.1 backend (`CV Studio API`) through a fully typed client, and keeps a clean line between server state and client state.

## Quick start

```bash
# 1. Personalize the template (names, locales, tenant header, …)
pnpm init:project

# 2. Install dependencies
pnpm install

# 3. Generate typed API bindings from your backend's OpenAPI spec
OPENAPI_SPEC_URL=https://your-backend.example.com/openapi.json pnpm openapi:gen

# 4. Run the dev server (Turbopack)
pnpm dev
```

## Customize your fork

This repo is a **business-logic-agnostic** starter. Turning it into a real product happens in two passes: mechanical (`pnpm init:project`) and judgment (domain, brand, rules). See [docs/getting-started/001_customize-your-fork.md](./docs/getting-started/001_customize-your-fork.md) for the full checklist and [docs/guides/001_fork-customization-example.md](./docs/guides/001_fork-customization-example.md) for a worked Acme Logistics example.

## Stack

Full snapshot: [AGENTS.md § Project snapshot](./AGENTS.md#project-snapshot).

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Server state | TanStack Query |
| Client state | Zustand |
| Forms | react-hook-form + `@hookform/resolvers` + Zod |
| API client | `openapi-fetch` (typed from OpenAPI 3.1) |
| Styling | Tailwind CSS v4 (CSS-variable theming) |
| Testing | Vitest + React Testing Library |
| Package manager | pnpm |

## Architecture in one minute

- **Feature modules** (`src/modules/`) — hexagonal layers exposed through a single `index.ts`; bounded contexts under `src/app/[lang]/(back-office)` and `(front-office)`.
- **State & API** — TanStack Query for server data, Zustand for client session; typed OpenAPI client in `src/core/api/`.

See [docs/architecture/00_index.md](./docs/architecture/00_index.md) for structure and patterns, and [AGENTS.md](./AGENTS.md) for enforceable rules.

## Documentation

| Doc | Purpose |
| --- | --- |
| [docs/README.md](./docs/README.md) | Central documentation index |
| [docs/getting-started/001_customize-your-fork.md](./docs/getting-started/001_customize-your-fork.md) | Fork checklist (mechanical + judgment) |
| [docs/getting-started/002_commands.md](./docs/getting-started/002_commands.md) | pnpm scripts reference |
| [docs/architecture/00_index.md](./docs/architecture/00_index.md) | Architecture hub |
| [docs/guides/001_fork-customization-example.md](./docs/guides/001_fork-customization-example.md) | Worked fork example |
| [AGENTS.md](./AGENTS.md) | AI coding-assistant rules (IDE-agnostic) |
| [llms.txt](./llms.txt) | Companion LLM context summary — keep in sync with AGENTS on fork |
