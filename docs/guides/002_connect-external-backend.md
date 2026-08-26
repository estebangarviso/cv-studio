# Connect an External Backend

How to migrate from the built-in API routes (monolithic) to an external backend service.

## When to stay monolithic

- Prototyping or demos with no real persistence
- Internal tools with < 5 entities and a single deployment target
- No team boundary between frontend and backend

## When to extract

- You need a dedicated database, auth service, or background jobs
- Multiple frontends consume the same API
- The backend team ships on a different cadence

---

## Step 1 — Generate OpenAPI types

Place your backend's OpenAPI 3.1 spec at `src/core/api/openapi.json`, then run:

```bash
pnpm openapi:gen
```

This outputs `src/core/api/v1.ts` with fully typed paths, request bodies, and responses.

## Step 2 — Replace in-memory repositories with HTTP adapters

Before (monolithic, calling local store):

```ts
// src/modules/users/infrastructure/repositories/user.repository.ts
import { users } from '@/app/api/users/_store';

export function getAll() {
  return Array.from(users.values());
}
```

After (external backend via openapi-fetch):

```ts
// src/modules/users/infrastructure/repositories/user.repository.ts
import { createApiCoreClient } from '@/core/api';
import type { paths } from '@/core/api/v1';

const client = createApiCoreClient<paths>(process.env.NEXT_PUBLIC_API_URL!);

export async function getAll() {
  const { data } = await client.GET('/users');
  return data ?? [];
}
```

## Step 3 — Point `ApiProvider` at the external service

In `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.your-service.dev
```

The `ApiProvider` in `src/core/providers.tsx` already reads this variable — no code change needed.

## Step 4 — Remove API routes

Once all modules use HTTP repositories, delete `src/app/api/` and remove the in-memory stores. The external backend is now the single source of truth.

---

## Summary

| Phase      | Data source                 | Transport                           |
| ---------- | --------------------------- | ----------------------------------- |
| Prototype  | `src/app/api/*` (in-memory) | Direct import                       |
| Hybrid     | External backend            | `openapi-fetch` in modules          |
| Production | External backend only       | `openapi-fetch`, API routes deleted |
