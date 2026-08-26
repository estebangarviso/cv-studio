# API access and transport

openapi-fetch is the preferred backend HTTP transport for typed external APIs. For the monolithic default (built-in API routes), modules can use `src/core/http/` directly.

## Transport decision gate

| #   | Use case                                 | Transport                        | Where                          |
| --- | ---------------------------------------- | -------------------------------- | ------------------------------ |
| 1   | Built-in API routes (monolithic default) | `fetch` / `getHttpClient()`      | `infrastructure/repositories/` |
| 2   | Typed external OpenAPI from a hook       | `useApiClient()` → openapi-fetch | `presentation/hooks/`          |
| 3   | Typed external OpenAPI behind a port     | `ApiCoreClient` via factory      | `infrastructure/repositories/` |
| 4   | SSR / edge (no React tree)               | Direct `fetch` or openapi-fetch  | Server Components, `server.ts` |

## Monolithic → external migration

When your backend grows beyond built-in API routes, see [docs/guides/002_connect-external-backend.md](../guides/002_connect-external-backend.md).

## Setup (external backend)

1. Generate types: `pnpm openapi:gen` → `src/core/api/v1.ts`
2. Wire `createApiCoreClient<paths>(baseUrl)` in your factories
3. `ApiProvider` injects `baseUrl` and optional `authToken`

## Environment variables

| Variable              | Scope       | Purpose                                  |
| --------------------- | ----------- | ---------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Client      | Browser-facing API origin                |
| `INTERNAL_API_URL`    | Server only | Optional private API origin for SSR/edge |

Never expose `INTERNAL_API_URL` to the client.
