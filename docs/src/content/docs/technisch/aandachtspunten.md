---
title: Bekende aandachtspunten
description: Naslaglijst van technical debt en zaken die opvallen bij het lezen van de web-codebase.
---

Deze pagina verzamelt dingen die opvielen bij het doorlichten van `web/` — geen kritiek, maar een naslaglijst zodat je ze herkent in plaats van opnieuw ontdekt. Waar relevant staat de bron erbij.

## Inhoudsopgave

1. [Beveiliging: vrije admin-zelfregistratie](#1-beveiliging-vrije-admin-zelfregistratie)
2. [Dode Drizzle-scaffolding naast het echte Prisma-systeem](#2-dode-drizzle-scaffolding-naast-het-echte-prisma-systeem)
3. [Wees-tabel `Todo` in de database](#3-wees-tabel-todo-in-de-database)
4. [Twee auth-lagen die uit elkaar kunnen lopen](#4-twee-auth-lagen-die-uit-elkaar-kunnen-lopen)
5. [Geen `Pharmacy`-model — hardcoded `pharmacyId: 'ph1'`](#5-geen-pharmacy-model--hardcoded-pharmacyid-ph1)
6. [Kleinere inconsistenties](#6-kleinere-inconsistenties)
7. [Testdekking](#7-testdekking)

---

## 1. Beveiliging: vrije admin-zelfregistratie

**Prioriteit: hoog.** Op het registratieformulier (`web/src/routes/_auth/register.tsx`) is "Admin" gewoon een van de opties in de Account type-keuzelijst, naast Customer en Pharmacy — er is geen enkele serverside controle (`web/src/lib/api/auth.ts` / `web/src/lib/auth.ts`) die dit tegenhoudt. Elke bezoeker kan zichzelf dus een admin-account aanmaken.

Dit is al erkend in `web/DEPLOYMENT.md` ("Restrict pharmacy/admin role assignment to staff onboarding; public signup should create customer accounts only") maar nog niet in code afgedwongen. Vóór een echte lancering moet de rol bij self-registratie serverside worden vastgezet op `customer`, met een apart, beveiligd pad om pharmacy/admin-accounts aan te maken.

## 2. Dode Drizzle-scaffolding naast het echte Prisma-systeem

Het project is ooit gestart vanuit TanStack's "create-db"-template, die standaard **Drizzle** meebrengt. Dat restant is blijven staan nadat het team op **Prisma** overstapte voor het echte schema:

- `web/drizzle.config.ts`, `web/src/db/index.ts`, `web/src/db/schema.ts` (definieert alleen een generieke `todos`-tabel), `web/public/drizzle.svg`.
- De npm-scripts `db:generate`/`db:push`/`db:migrate`/`db:studio`/`db:pull` roepen Drizzle Kit aan.
- Nergens in `web/src` wordt `#/db/index` of `#/db/schema` (de Drizzle-modules) geïmporteerd — het wordt daadwerkelijk nooit gebruikt.

**Gevolg:** `pnpm db:push` of `pnpm db:studio` draaien doet niets zinnigs tegen het echte schema en kan een nieuwe developer op het verkeerde been zetten. Gebruik voor database-werk altijd de Prisma-commando's (`pnpm exec prisma migrate dev/deploy`, `pnpm exec prisma studio`, `pnpm db:seed`). Aanbevolen: de Drizzle-bestanden, -scripts en -dependency op termijn verwijderen.

## 3. Wees-tabel `Todo` in de database

De eerste migratie (`web/prisma/migrations/20260809030131_init`) maakt naast de bedoelde tabellen ook een `Todo`-tabel aan — eveneens een restant van de scaffold-template. Deze tabel staat niet (meer) in `web/prisma/schema.prisma`, dus een verse database die vanaf de migraties wordt opgebouwd, bevat een tabel die Prisma niet kent/beheert. Geen directe schade, maar wel iets om op te ruimen (een nieuwe migratie die de tabel drop't) zodat schema en database weer één-op-één overeenkomen.

## 4. Twee auth-lagen die uit elkaar kunnen lopen

Zoals beschreven in [Data & authenticatie](/technisch/data-en-auth/): better-auth (server, echte grens) en `web/src/lib/customer-auth.ts` (client-only `localStorage`-spiegel, alleen voor UI) zijn twee gescheiden systemen die alleen bij expliciete in-/uitlogmomenten gesynchroniseerd worden. Er is geen doorlopend mechanisme (bv. een periodieke `getSession()`-check) dat de localStorage-kopie corrigeert als de echte sessie server-side verloopt of wordt ingetrokken. Behandel client-side rolchecks dus altijd als UI-gemak, nooit als beveiliging.

Bijkomend: `customer-auth.ts` bevat een volledig **dood mock-inlogsysteem** (`DEMO_USERS`, `signInUser`, `registerUser`, `getDemoUsers`, met een eigen `localStorage`-sleutel `he_registered_users`) dat alleen nog door `customer-auth.test.ts` wordt aangeroepen — de echte login-/registerpagina's gebruiken het niet meer. De daarin hardgecodeerde demo-inloggegevens werken dus niet op het echte inlogformulier; verwar ze niet met werkende testaccounts.

## 5. Geen `Pharmacy`-model — hardcoded `pharmacyId: 'ph1'`

Er bestaat geen `Pharmacy`-tabel in het Prisma-schema; apotheken zijn overal een los `pharmacyId`-string-veld. Concreet gevolg: `web/src/lib/dashboard-context.tsx` hardcodet `CURRENT_PHARMACY_ID = 'ph1'`, dus **elk ingelogd pharmacy-account beheert altijd dezelfde voorraad/bestellingen** ("Central Pharmacy"/`ph1`), ongeacht welk account daadwerkelijk is geregistreerd. Multi-tenant apotheekondersteuning (elke apotheek haar eigen voorraad/bestellingen, gekoppeld aan haar eigen account) is dus nog niet geïmplementeerd, ook al suggereert de UI (registratie met rol "Pharmacy", Cross-Pharmacy Overview in het Admin-scherm) dat dit wel het geval is.

## 6. Kleinere inconsistenties

- **Dubbele path alias**: `web/tsconfig.json` en `web/package.json` (`imports`-veld) definiëren zowel `#/*` als `@/*`, allebei wijzend naar `./src/*`. In de praktijk wordt overal alleen `#/` gebruikt — `@/*` lijkt te bestaan voor shadcn/ui-tooling-compatibiliteit maar is verder ongebruikt.
- **Dubbel roltype**: `UserRole` (`web/src/lib/types.ts`) en `AppRole` (`web/src/lib/customer-auth.ts`) zijn structureel identiek (`'customer' | 'pharmacy' | 'admin'`) maar apart gedeclareerd in plaats van hergebruikt.
- **`components.json` verwijst naar een `#/hooks`-alias** terwijl er nog geen `web/src/hooks/`-map bestaat.
- **`/api/db/notifications` heeft geen eigen `lib/api`-bestand** — in tegenstelling tot orders/products/reviews/messages staat de Prisma-query hier inline in de route zelf.
- **`@prisma/extension-accelerate`** staat als dependency in `package.json`, maar er is geen `.$extends(withAccelerate())`-aanroep gevonden — waarschijnlijk ongebruikt, te verwijderen of daadwerkelijk in te schakelen.
- **`web/README.md`** is nog de ongewijzigde generieke TanStack-starttekst (inclusief een voorbeeld-authsnippet met een losse `pg.Pool` dat niet overeenkomt met de echte Prisma-adapter-opzet) — niet gebruiken als naslag, gebruik deze technische documentatie of `web/DEPLOYMENT.md`.

## 7. Testdekking

Er bestaat op dit moment één testbestand (`web/src/lib/customer-auth.test.ts`, twee scenario's over pure functies), ondanks dat Vitest, Testing Library en jsdom al volledig zijn opgezet. Er zijn nog geen tests voor componenten, routes of de API-handlers. Zie [Ontwikkelen, testen & deployen](/technisch/ontwikkelen/#3-tests).
