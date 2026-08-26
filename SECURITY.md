# Security Policy

This repository is a **public, product-agnostic Next.js starter template**. It ships patterns and example code — not a hosted service. There is no production deployment, tenant data, or security inbox maintained by default.

## Report an issue in this template

| Situation | Where to report |
| --- | --- |
| Bug, docs mistake, broken example | **GitHub Issues** in this repository |
| Vulnerability in **this repo's** template code (XSS in a shared component, unsafe default in `init`, etc.) | **GitHub Security Advisories** (Security → Report a vulnerability) **or** a public issue if the finding is not exploitable in isolation |

Use **Security Advisories** when publishing details before a fix would help attackers abuse the template as-is. For everything else, a normal issue is fine and helps other adopters.

### What to include

- [ ] Description and impact on someone cloning the template
- [ ] Steps to reproduce in a fresh `pnpm init:project` checkout
- [ ] Affected path (e.g. `src/core/api/`, a module under `src/modules/`)
- [ ] PoC or screenshots if helpful
- [ ] Suggested fix (optional)

Maintainers respond on a **best-effort** basis; there is no production SLA for this boilerplate.

## If you fork this template for production

Replace this file (or the contact block below) before launch. Production apps need their own channel — private email, security alias, or GitHub Security Advisories on **your** repo — plus an SLA your team can honor.

```markdown
## Report a vulnerability (your product)

Do not open public issues for exploitable production bugs.
Contact: security@your-company.com
Optional: PGP public key for encrypted reports
```

The checklist and scope sections below are **guidance for contributors and adopters**, not a claim that this public template handles live user data.

## Supported versions

| Version | Supported |
| --- | --- |
| Latest on `main` | ✅ Template fixes and dependency bumps |
| Older forks | ❌ Adopters should merge or cherry-pick |

## Security patterns this template encodes

The browser is untrusted; **authorization belongs on your backend.** When extending the template, watch for:

| Area | Examples |
| --- | --- |
| **Secret exposure** | Secrets in the client bundle via `NEXT_PUBLIC_*`; keys in source |
| **Auth & session** | JWTs in `localStorage`, missing logout cleanup |
| **XSS & injection** | `dangerouslySetInnerHTML` with unsanitized data |
| **Tenant scoping** | Treating a client header as authorization without a server check |
| **SSRF / open redirect** | Server `fetch`/rewrites built from raw user input |
| **Supply chain** | Vulnerable or malicious npm deps, tampered lockfile |
| **Data exposure** | PII in logs, errors, source maps, or committed `.env` |

### Out of scope for this repo

- Vulnerabilities only in **your** forked app or **your** backend (use that project's policy).
- Findings in third-party packages (report upstream; we bump deps here when relevant).
- Client-only tricks with no server impact (disabled buttons, edited local state).
- Denial-of-service via otherwise valid usage.

## Contributor security checklist

- [ ] No secrets committed — use `.env*.local` (git-ignored), not `NEXT_PUBLIC_*` for secrets.
- [ ] Auth tokens not persisted in `localStorage`/`sessionStorage` unless you document the tradeoff.
- [ ] External input validated with Zod; server remains source of truth.
- [ ] No `dangerouslySetInnerHTML` without sanitized, trusted input.
- [ ] Server-side fetch targets from allowlists or validated env vars.
- [ ] `pnpm audit` shows no unresolved high/critical advisories before merge.
- [ ] Generated `src/core/api/v1.ts` has no hand-added secrets.
