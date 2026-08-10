---
title: Ontwikkelen, testen & deployen
description: Lokale setup, omgevingsvariabelen, npm-scripts, tests en de deployment-checklist.
---

## Inhoudsopgave

1. [Omgevingsvariabelen](#1-omgevingsvariabelen)
2. [npm-scripts](#2-npm-scripts)
3. [Tests](#3-tests)
4. [Lokaal starten](#4-lokaal-starten)
5. [Deployment-checklist](#5-deployment-checklist)
6. [Privacy en bewaartermijnen](#6-privacy-en-bewaartermijnen)

---

## 1. Omgevingsvariabelen

Bron: `web/.env.example`. Kopieer dit bestand naar `web/.env.local` en vul de waarden in.

| Variabele | Doel |
|---|---|
| `DATABASE_URL` | Gepoolde Neon Postgres-connectiestring — wat de app zelf op runtime gebruikt (zie [Data & authenticatie](/technisch/data-en-auth/)). |
| `DIRECT_URL` | Niet-gepoolde Neon-connectiestring, alleen nodig voor Prisma Migrate (via `web/prisma.config.ts`). |
| `BETTER_AUTH_SECRET` | Geheim waarmee better-auth sessies/tokens ondertekent en versleutelt. Genereren met `pnpm dlx @better-auth/cli secret`. |
| `BETTER_AUTH_URL` | De publieke basis-URL van de app (`http://localhost:3000` in dev), nodig zodat better-auth correcte callback-/cookie-URL's opbouwt. |

## 2. npm-scripts

Bron: `web/package.json`.

| Script | Commando | Doel |
|---|---|---|
| `dev` | `vite dev --port 3000` | Lokale dev-server. |
| `build` | `vite build` | Productiebuild. |
| `preview` | `vite preview` | Een productiebuild lokaal bekijken. |
| `generate-routes` | `tsr generate` | Route-boom (`routeTree.gen.ts`) handmatig regenereren — gebeurt normaal al automatisch tijdens `dev`/`build`. |
| `test` | `vitest run` | Tests eenmalig draaien. |
| `format` | `biome format` | Code formatteren. |
| `lint` | `biome lint` | Linten. |
| `check` | `biome check` | Gecombineerde lint- en formatcontrole. |
| `db:seed` | `dotenv -e .env.local -- prisma db seed` | **Het enige echte database-script** — vult de database met de seed-data (zie [Data & authenticatie](/technisch/data-en-auth/)). |

## 3. Tests

- Testrunner: **Vitest** (`pnpm test` → `vitest run`), met `@testing-library/react`, `@testing-library/dom` en `jsdom` als devDependencies.
- Er bestaat momenteel **één testbestand**: `web/src/lib/customer-auth.test.ts` (gebruikt de pragma `// @vitest-environment jsdom`, want er is geen globale jsdom-omgeving in `web/vite.config.ts` ingesteld). Het test twee dingen: het (dode) mock-inlogsysteem in `customer-auth.ts`, en de product-scoping van `web/src/lib/reviews-store.ts`.
- Er zijn (nog) geen component- of route-tests, ondanks dat Testing Library al is geïnstalleerd.

## 4. Lokaal starten

1. `pnpm install` in `web/`.
2. `web/.env.example` kopiëren naar `web/.env.local` en invullen (zie boven).
3. `pnpm exec prisma migrate deploy` (of `migrate dev` tijdens ontwikkeling) om het schema toe te passen.
4. `pnpm db:seed` om voorbeelddata te laden.
5. `pnpm dev` — de app draait op `http://localhost:3000`.

## 5. Deployment-checklist

Overgenomen uit `web/DEPLOYMENT.md` (het enige projectspecifieke README-achtige bestand — `web/README.md` zelf is nog de ongewijzigde generieke TanStack-templatetekst en is geen betrouwbare bron):

1. Zet `DATABASE_URL`, `BETTER_AUTH_SECRET` en `BETTER_AUTH_URL` bij de hostingprovider.
2. Draai `pnpm exec prisma migrate deploy` en `pnpm exec prisma db seed` tegen de productiedatabase.
3. Alleen achter HTTPS deployen — locatietoegang en veilige sessiecookies zijn hiervan afhankelijk.
4. Sla recept-, ID- en productafbeeldingen op in private object storage vóór productiegebruik; bewaar geen documentdata-URL's op schaal in de database.
5. Regel back-ups, foutmonitoring, een uitgaande-e-mailprovider en een geverifieerd supportadres.
6. **Beperk het toekennen van de pharmacy/admin-rol tot staff-onboarding; publieke self-registratie hoort alleen klantaccounts aan te maken.**

## 6. Privacy en bewaartermijnen

Ook uit `web/DEPLOYMENT.md`:

- Verzamel alleen gegevens die nodig zijn om bestellingen te verwerken en te verifiëren.
- Beperk toegang tot recepten en ID-documenten tot geautoriseerd apotheekpersoneel en log die toegang.
- Bepaal een bewaartermijn en een veilig verwijderproces voor bestellingen en documenten.
- Publiceer een getoetst privacybeleid, toestemmingstekst, contactproces en een proces voor verzoeken van betrokkenen vóór lancering.
- Laat lokale juridische/privacy-deskundigen de workflow beoordelen voordat er echte medische documenten worden geaccepteerd.
