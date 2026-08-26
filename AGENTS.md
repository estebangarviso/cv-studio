# AGENTS.md

Canonical, IDE-agnostic instructions for any AI coding assistant working in this repository (Cursor, Copilot, Claude, etc.). This file, together with `package.json`, `README.md`, and `docs/README.md`, is the single source of truth. Do not duplicate rules elsewhere — reference this file.

**Source-of-truth ownership:** `AGENTS.md` owns enforceable rules and conventions; `README.md` owns onboarding and quick start; `docs/README.md` + `docs/architecture/00_index.md` own structure, diagrams, and patterns. Do not copy rule blocks into those files — link here instead.

> **Forked from the agnostic starter?** This file ships template *defaults*. Adapt it
> to your product: add your product name and a domain glossary, list your real modules
> under **Architecture rules**, and rewrite the agnostic guardrails in **What NOT to do**
> (notably the *"no proprietary product names"* line, which flips once you have a product).
> See **[README → Customize your fork](./README.md#customize-your-fork)** for the full checklist
> and **[docs/guides/001_fork-customization-example.md](./docs/guides/001_fork-customization-example.md)** for a worked example.

## Project snapshot

| Topic              | Value                                                                 |
| ------------------ | --------------------------------------------------------------------- |
| Framework          | Next.js 16 (App Router, Turbopack), React 19                          |
| Language           | TypeScript, strict mode                                               |
| Server state       | TanStack Query (`@tanstack/react-query`)                              |
| Client state       | Zustand (`zustand`)                                                   |
| Forms              | `react-hook-form` + `@hookform/resolvers` + Zod                       |
| API client         | `openapi-fetch`, typed from an OpenAPI 3.1 spec                       |
| Styling            | Tailwind CSS v4, CSS variable theming                                 |
| Testing            | Vitest + React Testing Library                                        |
| Package manager    | pnpm                                                                  |
| Verify before done | `pnpm lint` and `pnpm type-check` (and `pnpm test` for logic changes) |

## Architecture rules

This is a modular, microfrontend-ready app using Domain-Driven Design + Hexagonal layering.

- **Modules are independent units** — each `src/modules/<name>/` owns its `domain`, `infrastructure`, and `presentation`.
- **Public API pattern** — import from `@modules/<name>` (the barrel `index.ts`) only, never internal paths.
- **Domain is pure** — `domain/` has ZERO framework imports; entities are Zod schemas with inferred types.
- **Ports & adapters** — `domain/interfaces/` declares contracts; `infrastructure/` implements them.
- **SSR for optimization only** — business logic lives in modules, not in server actions or route handlers.

### Directory map

```
src/
├── app/            # App Router: routing + composition ONLY
│   └── [lang]/     # (back-office) and (front-office) bounded contexts
├── core/           # Shared kernel
│   ├── api/        # openapi-fetch client + ApiProvider (preferred transport)
│   ├── query/      # TanStack Query provider
│   ├── http/       # Zod-validated fetch helper + getHttpClient() singleton
│   └── providers.tsx
├── modules/<name>/ # domain/ · infrastructure/ · presentation/ · index.ts
└── shared/         # Global types, UI primitives, utils
```

## State management (critical)

Choose by ownership. Never mirror server data into a client store.

| Data owner             | Tool                                        | Location                             |
| ---------------------- | ------------------------------------------- | ------------------------------------ |
| Backend (async)        | TanStack Query (`useQuery` / `useMutation`) | `presentation/hooks/use-*.ts`        |
| Browser session (sync) | Zustand `create()` store                    | `presentation/state/<name>.store.ts` |

```typescript
// Client state — Zustand
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setSession: (s) => set({ user: s.user, isAuthenticated: true }),
  clearSession: () => set({ user: null, isAuthenticated: false }),
}));

// Server state — TanStack Query
const loginMutation = useMutation({
  mutationFn: (creds: LoginCredentials) => loginUseCase.execute(creds),
  onSuccess: (session) => setSession(session),
});
```

Do **NOT** introduce Redux, MobX, or other centralized state managers.

## Forms

Use `react-hook-form` with `zodResolver` exclusively. Define the schema with Zod, infer the value type, and wire fields via `register`.

```tsx
const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
type Values = z.infer<typeof schema>;
const { register, handleSubmit, formState: { errors } } =
  useForm<Values>({ resolver: zodResolver(schema) });
```

## API access

| Use case                                 | Transport                        | Where                          |
| ---------------------------------------- | -------------------------------- | ------------------------------ |
| Built-in API routes (monolithic default) | `fetch` / `getHttpClient()`      | `infrastructure/repositories/` |
| Typed external OpenAPI from a hook       | `useApiClient()` / openapi-fetch | `presentation/hooks/`          |
| Typed external OpenAPI behind a port     | `ApiCoreClient` via factory      | `infrastructure/repositories/` |
| SSR / edge (no React tree)               | Direct `fetch` or openapi-fetch  | Server Components, `server.ts` |

- Generate types: `pnpm openapi:gen` → `src/core/api/v1.ts` (git-ignored).
- Build a client with `createApiCoreClient(baseUrl)`; inject it via `ApiProvider` and read with `useApiClient()`.
- Do NOT hardcode API URLs; use env vars and the provider.

## Styling

- Tailwind CSS v4 only. **No SCSS** for new work.
- Theming uses native CSS variables (see `docs/architecture/005_theming.md`), not per-build themes.

## i18n

- `next-intl` with config in `src/i18n/` (routing, request).
- Messages in `src/modules/i18n/messages/{locale}.json`.
- Client: `use-locale.ts` hook. Server: import from `server.ts`.

## Input pacing (optional)

`@tanstack/react-pacer` is not included by default. Install it when your fork needs debounce/throttle for search or live filters — never hand-roll `setTimeout` or add Lodash/RxJS for this.

## Naming conventions

| Thing          | Convention                                          |
| -------------- | --------------------------------------------------- |
| Files          | `kebab-case.ts` / `kebab-case.tsx`                  |
| Components     | `PascalCase`                                        |
| Hooks          | `use-<name>.ts` exporting `useName()`               |
| Zustand stores | `<name>.store.ts` exporting `useNameStore`          |
| Entities       | `<name>.ts` with `NameSchema` + inferred `Name`     |
| Ports          | `<name>-repository.interface.ts`                    |
| Mappers        | `<name>.mapper.ts` exporting `<Name>Mapper` object  |
| Module wiring  | `<name>.factory.ts` exporting `getX()` accessors    |
| Server barrel  | Optional `server.ts` for server-only module exports |

## What NOT to do

- No Redux / centralized state managers.
- No SCSS for new styles.
- No `reflect-metadata`, decorators, DI containers, or service locators — wire dependencies with plain module imports / factory functions.
- No business logic in server actions or route handlers.
- No imports from another module's internal paths.
- No `any` — use Zod schemas and inferred types.
- No proprietary product names — this template is business-logic agnostic. _(Template default: remove this line once you fork into a real product.)_

## Agent playbooks

### Implementer

1. Locate the correct layer: `domain` (pure logic), `infrastructure` (adapters), `presentation` (React).
2. Model data with Zod; expose the module only through `index.ts`.
3. Server data → TanStack Query; client facts → Zustand; forms → react-hook-form + Zod.
4. Add tests for new components, hooks, and use cases.

### Debugger

1. **Identify** the layer (domain / infrastructure / presentation / core).
2. **Isolate** with a unit test that reproduces the bug.
3. **Trace** the flow: Component → Hook (Query) → Use Case → Repository → API client.
4. **Fix** in the correct layer; **verify** with `pnpm test` and `pnpm type-check`.
   - Query issues: check `queryKey`, `staleTime`, and provider placement.
   - Store issues: check selector usage and action wiring.
   - API issues: verify `NEXT_PUBLIC_API_URL`, generated types, and tenant headers.

### Reviewer / mentor

- Does the change respect module boundaries (no internal imports)?
- Is logic in the right layer (domain, not presentation)?
- Is server data in Query and client state in Zustand (not conflated)?
- Are inputs/outputs validated with Zod?
- Are there tests, and is the code accessible (ARIA, semantic HTML)?
