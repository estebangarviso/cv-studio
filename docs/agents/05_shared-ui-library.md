# Shared UI library — compose, don't duplicate

Reuse `@shared/ui` for presentational chrome; keep domain mapping in module `presentation/`.

## Decision gate — where does UI go?

| Need                                                  | Put it in                              | Example                    |
| ----------------------------------------------------- | -------------------------------------- | -------------------------- |
| Primitive (button, input, dialog, drawer, card, tabs) | `src/shared/ui/primitives/` via shadcn | `Button`, `Card`, `Dialog` |
| Layout (container, section, grid)                     | `src/shared/ui/layout/`                | `Grid`, `SectionTitle`     |
| Feedback (spinner, empty state)                       | `src/shared/ui/feedback/`              | `EmptyState`, `Spinner`    |
| Data display (tables)                                 | `src/shared/ui/data-display/`          | `DataTable`                |
| Domain-specific (entity mapping, hooks)               | `modules/<name>/presentation/`         | `UserCard`                 |

**Rule of thumb:** If two or more modules need the same visual pattern _without_ domain types, promote it to `shared/ui`. If it needs entity types or a Query hook, it stays in the module.

## Import rules

| Rule                 | Detail                                               |
| -------------------- | ---------------------------------------------------- |
| Barrel only          | `import { Button, Card } from '@shared/ui'`          |
| No upward deps       | `shared/ui` never imports `@modules/*`               |
| Presentational props | Accept strings, numbers, ReactNode — no entity types |
| Variants             | Extend via `className` or `buttonVariants()`         |

## What NOT to do

| Anti-pattern                        | Do instead                                            |
| ----------------------------------- | ----------------------------------------------------- |
| Copy `cva` variants into a module   | Import from `@shared/ui`                              |
| Put entity types in `shared/ui/`    | Map entity → props in module component                |
| Run `shadcn add` into `modules/`    | Registry lands in `primitives/` per `components.json` |
| Add primitive without barrel export | Re-export from `src/shared/ui/index.ts`               |

## shadcn workflow

```bash
pnpm dlx shadcn@latest add <name> --overwrite
```

1. File lands in `src/shared/ui/primitives/`.
2. Re-export from `src/shared/ui/index.ts`.
3. Compose in `layout/` or `feedback/` for cross-module widgets.
