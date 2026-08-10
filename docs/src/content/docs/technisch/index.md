---
title: Technische documentatie
description: Architectuur en techniek achter het HealthEase-project (map web/) voor ontwikkelaars.
---

Dit deel is voor **ontwikkelaars** die aan de HealthEase-applicatie (map `web/`) werken. Zoek je uitleg over het gebruik van de app zelf, ga dan naar de [Gebruikershandleiding](/handleiding/).

## Inhoudsopgave

1. [Techstack in het kort](#1-techstack-in-het-kort)
2. [Architectuur op hoofdlijnen](#2-architectuur-op-hoofdlijnen)
3. [Waar vind ik wat](#3-waar-vind-ik-wat)

---

## 1. Techstack in het kort

| Laag | Technologie | Bron |
|---|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, file-based routing via TanStack Router) | `web/package.json`, `web/src/routes/` |
| Build/dev server | Vite 8, met de server-laag via **Nitro** (`nitro-nightly`) | `web/vite.config.ts` |
| Database | PostgreSQL, gehost op **Neon** | `web/.env.example` |
| ORM | **Prisma 7** (via de driver-adapter `@prisma/adapter-pg`) | `web/prisma/schema.prisma`, `web/src/db.ts` |
| Authenticatie | **better-auth**, met een Prisma-adapter | `web/src/lib/auth.ts` |
| Styling | Tailwind CSS v4 (CSS-first configuratie, geen `tailwind.config.*`) | `web/src/styles.css` |
| Lint/format | Biome | `web/biome.json` |
| Tests | Vitest + Testing Library | `web/src/**/*.test.*` |
| Package manager | pnpm (workspace) | `web/package.json`, `pnpm-workspace.yaml` |

## 2. Architectuur op hoofdlijnen

Een verzoek doorloopt globaal dit pad:

1. **Route** — TanStack Router matcht de URL op een bestand onder `web/src/routes/` (file-based routing, zie [Project- en mappenstructuur](/technisch/structuur/)).
2. **Pagina- of API-route** — publieke pagina's renderen direct; API-routes (`web/src/routes/api/**`) valideren eerst de sessie met `requireSession()` uit `web/src/lib/auth.ts` (behalve de paar bewust publieke endpoints, zoals het versturen van een contactbericht).
3. **Data-laag** — `web/src/lib/api/*.ts` bevat de eigenlijke Prisma-queries; `web/src/db.ts` levert de gedeelde `PrismaClient` (via `@prisma/adapter-pg`, verbonden met de gepoolde Neon-URL uit `DATABASE_URL`).
4. **Database** — PostgreSQL op Neon, schema en migraties beheerd door Prisma (`web/prisma/schema.prisma` en `web/prisma/migrations/`).

Authenticatie loopt via een apart pad: **better-auth** beheert de echte, servergevalideerde sessie (httpOnly cookie); de app houdt daarnaast een **losse, client-only kopie** bij in `localStorage` voor UI-weergave. Dit onderscheid is belangrijk genoeg om een eigen pagina te krijgen — zie [Data & authenticatie](/technisch/data-en-auth/).

## 3. Waar vind ik wat

- **[Project- en mappenstructuur](/technisch/structuur/)** — routing-conventies, componentenindeling, state management (React contexts), styling/design tokens.
- **[Data & authenticatie](/technisch/data-en-auth/)** — het Prisma-datamodel, migraties, seed-data, hoe authenticatie écht werkt, en de API-routes.
- **[Ontwikkelen, testen & deployen](/technisch/ontwikkelen/)** — lokale setup, omgevingsvariabelen, npm-scripts, tests, deployment-checklist.
- **[Bekende aandachtspunten](/technisch/aandachtspunten/)** — een naslaglijst van technical debt en dingen die opvallen bij het lezen van de code (dode scaffolding, dubbele types, ontbrekende testdekking, een openstaand beveiligingspunt).
