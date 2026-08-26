# Fork customization example — Acme Logistics

A concrete, end-to-end walkthrough of turning this agnostic starter into a real product. Follows the two passes from [Customize your fork](../getting-started/001_customize-your-fork.md): mechanical `pnpm init:project`, then judgment edits with your team or an AI assistant.

> Scenario: **Acme Logistics** — a multi-tenant SaaS console for shipment operations. Fictional product used only to show the shape of the edits.

## Quick path

1. Run `pnpm init:project` with Acme values (see [Pass 1](#pass-1--pnpm-initproject-mechanical)).
2. Adapt `AGENTS.md`, theme, and modules ([Pass 2](#pass-2--judgment-adapt-with-your-team--ai-assistant)).
3. Verify with `pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm dev`.

## Pass 1 — `pnpm init:project` (mechanical)

```text
$ pnpm init:project

  project-name      (e.g. my-project):                  acme-logistics
  app-name          (e.g. my-project-frontend):          acme-logistics-frontend
  app-title         (e.g. My Project, optional):         Acme Logistics
  app-description   (e.g. Enterprise app, optional):     Acme Logistics — shipment operations console
  app-backend-title (e.g. My Project Backend):           Acme Logistics API
  base-path         (e.g. /app):                         /app
  base-url          (e.g. https://myapp.com):            https://app.acmelogistics.com
  font-family       (e.g. Inter, Geist_Sans, optional):  Inter
  font-weights      (e.g. '400', '600', '700'):          '400', '500', '600', '700'
  default-locale    (e.g. en, optional):                 en
  supported-locales (comma-separated, e.g. en,es):       en,es
  default-branch    (e.g. main, develop, optional):     develop
```

| Placeholder → value                          | Shows up as                                                  |
| -------------------------------------------- | ------------------------------------------------------------ |
| `app-title` → `Acme Logistics`               | `<title>`, PWA manifest `name`, `README` heading, `llms.txt` |
| `app-backend-title` → `Acme Logistics API`   | Doc + code comments describing the backend                   |
| `base-url` → `https://app.acmelogistics.com` | `metadataBase`, `.env`, manifest                             |
| `supported-locales` → `'en', 'es'`           | `src/modules/i18n/domain/entities/locale.ts`                 |
| `default-branch` → `develop`                 | `.github/workflows/ci.yml` branch triggers                   |

Then:

```bash
pnpm install
OPENAPI_SPEC_URL=https://api.acmelogistics.com/openapi.json pnpm openapi:gen
```

## Pass 2 — judgment (adapt with your team / AI assistant)

### 2.1 — `AGENTS.md`

Add product name, glossary, and real modules. Remove the *"no proprietary product names"* template-default line.

```markdown
## Domain glossary

| Term     | Meaning                                             |
| -------- | --------------------------------------------------- |
| Shipment | A tracked movement of goods with a status lifecycle |
| Carrier  | A logistics provider that fulfills a shipment       |
| Manifest | A batch of shipments handed to a carrier            |
| Lane     | An origin → destination route with negotiated rates |

## Modules

| Module      | Owns                                    |
| ----------- | --------------------------------------- |
| `auth`      | Session, login, tenant resolution       |
| `shipments` | Shipment lifecycle, tracking, filtering |
| `carriers`  | Carrier directory and rate cards        |
| `billing`   | Invoices and usage                      |
```

### 2.2 — Brand & theme

Set palette in `src/app/globals.css` (HSL channels, no `hsl()` wrapper):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 221 83% 53%;          /* Acme blue #2563eb */
  --primary-foreground: 0 0% 100%;
  --ring: 221 83% 53%;
}
```

Match `src/app/manifest.ts`: `theme_color: '#2563eb'`. Add icons to `public/icons/`.

### 2.3 — Replace example scaffolding

Replace hardcoded `customers` / `employees` tables with a real module. Follow the [module contract](../architecture/004_module-contract.md) when adding `src/modules/shipments/`.

Hook (`src/modules/shipments/presentation/hooks/use-shipments.ts`):

```ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@core/api/context';

export function useShipments() {
  const { client, tenantId } = useApiClient();
  return useQuery({
    queryKey: ['shipments', tenantId],
    queryFn: async () => {
      const { data, error } = await client.GET('/shipments');
      if (error) throw error;
      return data;
    },
  });
}
```

Table wrapper — match the `CustomersTable` pattern with `DataTable` from `@shared/ui`.

### 2.4 — Ops files

| File                 | Change                                                  |
| -------------------- | ------------------------------------------------------- |
| `.github/CODEOWNERS` | Replace `@OWNER` with `@acme/frontend`                  |
| `SECURITY.md`        | Disclosure contact: `security@acmelogistics.com`        |
| `.env`               | `NEXT_PUBLIC_API_URL=https://api.acmelogistics.com/api` |

## Verify

```bash
pnpm lint
pnpm type-check
pnpm test    # when adding hooks, modules, or use-case logic
pnpm dev
```

The fork boots as **Acme Logistics**, headers carry `X-Acme-Tenant`, the API is typed against the Acme spec, and `AGENTS.md` reflects the real domain.
