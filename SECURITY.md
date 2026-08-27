# Security Policy

## Report a vulnerability

Contact: e.garvisovenegas@gmail.com

Do not open public issues for exploitable bugs. Use GitHub Security Advisories or email.

## Supported versions

| Version          | Supported |
| ---------------- | --------- |
| Latest on `main` | Yes       |

## Security checklist

- No secrets in `NEXT_PUBLIC_*` env vars.
- Auth tokens handled by Auth.js server-side — never in localStorage.
- Google Drive access scoped to `drive.file` (app-created files only).
- All inputs validated with Zod at system boundaries.
- `.env.local` is git-ignored.
