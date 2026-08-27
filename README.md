# CV Studio

CV builder with Google OAuth, Google Drive storage, and browser-native PDF export.

## Quick start

```bash
pnpm install
cp .env.local.example .env.local   # add your Google OAuth credentials
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | Random secret for Auth.js (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |

Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Set redirect URI to `http://localhost:3000/api/auth/callback/google`.

## Stack

| Concern | Choice |
|---------|--------|
| Framework | Next.js 16 (App Router), React 19 |
| Auth | Auth.js v5 (Google OAuth) |
| Storage | Google Drive API v3 |
| Forms | react-hook-form + Zod |
| State | TanStack Query (server) + Zustand (client) |
| Styling | Tailwind CSS v4 |
| PDF | `window.print()` + `@media print` CSS |
| i18n | next-intl (es, en) |
| Deploy | Vercel |

## Architecture

Feature modules in `src/modules/` with hexagonal layering (domain / infrastructure / presentation). See [AGENTS.md](./AGENTS.md) for conventions and [docs/](./docs/) for deep dives.
