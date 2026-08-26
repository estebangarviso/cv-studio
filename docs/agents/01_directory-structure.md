# Repository directory structure

Layout for this template. Canonical agent rules: [AGENTS.md](../../AGENTS.md).

## Top-level tree

```
src/
├── app/[locale]/            # (back-office) and (front-office) bounded contexts
├── core/                    # api/ (openapi-fetch), query/, http/, providers.tsx
├── modules/<name>/          # domain · infrastructure · presentation · index.ts
└── shared/                  # Global UI + styles + utils + config
    ├── ui/primitives/       # shadcn components
    ├── config/              # App-wide config constants
    ├── hooks/               # Cross-module shared hooks
    ├── schemas/             # Shared Zod schemas (pagination, errors)
    └── styles/              # Global CSS utilities
```

## Module layout

Each `src/modules/<name>/` is an independent hexagonal unit:

```
modules/<name>/
├── domain/
│   ├── entities/            # Zod schemas + inferred types (pure)
│   ├── interfaces/          # Ports (repository contracts)
│   └── use-cases/           # Optional orchestration
├── infrastructure/
│   ├── mappers/             # Wire → domain
│   ├── repositories/        # Port adapters (HTTP / openapi-fetch)
│   └── <name>.factory.ts    # Wiring: singleton or client-injected
├── presentation/
│   ├── components/
│   ├── hooks/               # TanStack Query hooks
│   └── state/               # Zustand stores
├── index.ts                 # Public barrel — @modules/<name>
└── server.ts                # Optional server-only barrel
```

## Factory wiring

| Pattern                         | Example                     | When                                   |
| ------------------------------- | --------------------------- | -------------------------------------- |
| **Context-scoped** (client arg) | `getUserRepository(client)` | openapi-fetch from `useApiClient()`    |
| **Singleton**                   | `getAuthRepository()`       | Module with no external API dependency |

## Public API

Import modules only via `@modules/<name>`. Never reach into another module's internal paths.
