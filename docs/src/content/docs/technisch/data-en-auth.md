---
title: Data & authenticatie
description: Het Prisma-datamodel, migraties, seed-data, authenticatie en de API-routes.
---

Dit deel beschrijft hoe HealthEase gegevens opslaat en hoe authenticatie werkt.

## Inhoudsopgave

1. [Databasemodel](#1-databasemodel)
2. [Migraties](#2-migraties)
3. [Seed-data](#3-seed-data)
4. [Databaseverbinding](#4-databaseverbinding)
5. [Authenticatie — twee lagen](#5-authenticatie--twee-lagen)
6. [API-routes](#6-api-routes)

---

## 1. Databasemodel

Bron: `web/prisma/schema.prisma` (PostgreSQL, gegenereerd naar `web/src/generated/prisma` — niet naar de standaard `node_modules/@prisma/client`-locatie).

| Model | Belangrijkste velden | Relaties / bijzonderheden |
|---|---|---|
| **User** | `id`, `email` (uniek), `name?`, `image?`, `emailVerified`, `role` (`String`, default `"customer"`) | De better-auth-gebruikerstabel, uitgebreid met het app-specifieke `role`-veld. Heeft `sessions`, `accounts`, `reviews`, `orders`, `contactMessages`, `notifications`. |
| **Session** | `token` (uniek), `expiresAt`, `ipAddress?`, `userAgent?` | better-auth sessietabel, cascade op verwijderen van de user. |
| **Account** | `providerId`+`accountId` (uniek paar), `password?` | better-auth credential/OAuth-tabel; `password` bevat de gehashte wachtwoordhash voor e-mail/wachtwoord-login. OAuth-velden zijn ongebruikt (geen social providers geconfigureerd). |
| **Verification** | `identifier`, `value`, `expiresAt` | better-auth verificatie-/tokentabel, geen FK naar User. |
| **Category** | `id` (handmatige slug, bv. `"first-aid"`), `name`, `slug` (uniek), `image` | Heeft veel `products`. |
| **Product** | `id`, `name`, `description`, `price`, `categoryId` (FK), `imageUrl`, `subCategory?`, `pharmacyId` (default `"ph1"`), `ingredients[]`, `dosage?`, `usage?`, `conditions[]` | **Geen `Pharmacy`-model** — een apotheek is enkel een los `pharmacyId`-string-veld. Eén-op-één met `stock`. |
| **StockEntry** | `pharmacyId`, `productId` (uniek — één voorraadregel per product), `quantity` | Cascade bij verwijderen van het product. |
| **Review** | `userId` (FK), `productId` (los veld, **geen FK**), `rating`, `comment` | `productId` is bewust niet relationeel — reviews blijven bestaan ook als een product verwijderd wordt. |
| **ContactMessage** | `userId?` (FK, `onDelete: SetNull`), `name`, `email`, `location`, `type`, `message`, `readAt?` | Optioneel gekoppeld aan een ingelogde gebruiker. |
| **Order** | `userId` (FK), `pharmacyId`, klant-/bezorggegevens (`customerName`, `email`, `phone`, `deliveryMethod`, `deliveryAddress?`, `pickupTime?`, `customerLat/Lng?`, `distanceKm?`, `deliveryNotes?`), documentpaden (`prescriptionPath?`, `idCardPath?`), prijsopbouw (`bagTotal`, `adminFee`, `platformFee`, `deliveryFee`, `totalAmount`), `status` (default `"pending"`), `paymentStatus` (default `"unpaid"`) | Heeft veel `items`. |
| **OrderItem** | `orderId` (FK), `productId` (los veld, **geen FK**), `productName`, `unitPrice`, `quantity` | Regels zijn een momentopname (naam/prijs worden gekopieerd), niet live gekoppeld aan `Product`. |
| **Notification** | `userId` (FK), `title`, `message`, `readAt?` | Index op `(userId, createdAt)`. |

**Let op bij het lezen van deze code:**
- `role` is een gewone `String`, geen Prisma-enum — de toegestane waarden (`customer`/`pharmacy`/`admin`) worden alleen in applicatiecode afgedwongen.
- Prijzen op een `Order` worden als platte `Float`-velden opgeslagen zoals de client ze meestuurt bij het aanmaken — er is geen serverside herberekening gevonden in `web/src/lib/api/orders.ts`.

## 2. Migraties

Bron: `web/prisma/migrations/` (provider vastgezet op `postgresql` in `migration_lock.toml`).

| Migratie | Wat het toevoegt |
|---|---|
| `20260809030131_init` | `User`, `Session`, `Account`, `Verification` (better-auth) + vroege `Review`, `ContactMessage`, `Order`. Maakt ook een **`Todo`-tabel** aan — een scaffold-restant dat niet (meer) in `schema.prisma` voorkomt (zie [Bekende aandachtspunten](/technisch/aandachtspunten/)). |
| `20260809090000_catalog_and_order_items` | `Category`, `Product`, `StockEntry`, `OrderItem`; `Order.updatedAt`; FK's (`Product→Category`, `StockEntry→Product`, `OrderItem→Order`). |
| `20260809120000_notifications` | `Notification` + FK naar `User`, index op `(userId, createdAt)`. |
| `20260810010000_product_details` | `Product.ingredients`, `Product.dosage`, `Product.usage`, `Product.conditions`. |

## 3. Seed-data

`web/prisma/seed.ts` (gedraaid via `pnpm db:seed`) vult de database met:

1. 9 `Category`-rijen (personal-care, diabetic-care, supplements, devices, vitamins, first-aid, allergy, immune-support, pain-fever).
2. 12 `Product`-rijen met realistische apotheekdata (ingrediënten, dosering, gebruik, aandoeningen) plus een bijbehorende `StockEntry` per product.
3. Eén demo-klant: `customer@healthease.com` ("Denver").
4. Twee demo-`Order`s voor die klant (één `on_its_way`/betaald, één `pending`/onbetaald) met bijbehorende `OrderItem`s.
5. Eén demo-`Review` (let op: met `productId: 'account-review'`, een niet-bestaand product-id — consistent met het niet-relationele `productId`-veld hierboven).

Het seed-script maakt zijn eigen `PrismaClient`/`PrismaPg`-instantie aan (niet via `web/src/db.ts`) — een kleine duplicatie, geen fout.

## 4. Databaseverbinding

Bron: `web/src/db.ts`, `web/prisma.config.ts`, `web/.env.example`.

De app gebruikt **twee verschillende connectiestrings voor twee verschillende doeleinden**:

- **`DATABASE_URL`** — de **gepoolde** Neon-verbinding. Dit is wat de applicatie zelf op runtime gebruikt: `web/src/db.ts` maakt een gedeelde `PrismaClient` aan via de `PrismaPg`-driver-adapter, altijd verbonden met `DATABASE_URL`.
- **`DIRECT_URL`** — Neon's **niet-gepoolde** verbinding, specifiek nodig voor Prisma Migrate (de pooler ondersteunt niet de transactiesemantiek die migraties vereisen). `web/prisma.config.ts` (de Prisma 7-configuratiestijl) stelt de CLI-datasource (voor `prisma migrate`, `prisma db seed`, `prisma studio`) in op `DIRECT_URL`, met een fallback naar `DATABASE_URL` als die niet gezet is.

`schema.prisma` zelf declareert geen `url`/`directUrl` in het `datasource`-blok — die verbinding wordt dus volledig door `prisma.config.ts` (voor de CLI) en `db.ts` (voor de app) geregeld, niet door het schema-bestand.

Een `globalThis.__prisma`-singleton-guard in `db.ts` voorkomt dat elke hot-module-reload in dev een nieuwe `PrismaClient` (en dus nieuwe DB-connecties) aanmaakt.

## 5. Authenticatie — twee lagen

Dit is het belangrijkste punt om te begrijpen voordat je aan auth-gerelateerde code werkt: **er zijn twee gescheiden mechanismen, en ze zijn niet hetzelfde.**

### A. better-auth — de echte, serverzijdige sessie

- `web/src/lib/auth.ts` configureert `betterAuth()` met een Prisma-adapter (persisteert in de `User`/`Session`/`Account`/`Verification`-modellen hierboven), `emailAndPassword` (geen social login), en het custom `role`-veld (`customer`/`pharmacy`/`admin`, default `customer`).
- `web/src/routes/api/auth/$.ts` is een catch-all route die élk verzoek naar `/api/auth/*` doorgeeft aan `auth.handler(request)` — dit ene bestand bedient dus alle better-auth-endpoints (inloggen, registreren, uitloggen, sessie opvragen, ...).
- `web/src/lib/auth-client.ts` (`createAuthClient()` uit `better-auth/react`) is de browser-SDK die de httpOnly sessiecookie beheert; `login.tsx`/`register.tsx` roepen deze rechtstreeks aan (`authClient.signIn.email(...)`, `authClient.signUp.email(...)`).
- **Dit is de enige echte autorisatiegrens.** Elke gevoelige API-route (zie hieronder) roept `requireSession(request, verplichteRol?)` aan, wat de cookie herverifieert tegen de echte `Session`-tabel en optioneel een rol afdwingt.

### B. `customer-auth.ts` — een client-only spiegel, geen beveiligingsgrens

- `web/src/lib/customer-auth.ts` bewaart een `CustomerSession`-object (`id?, name, email, phone, role`) in `localStorage` (`he_customer_session`).
- Wordt breed gebruikt (12 bestanden) om de ingelogde gebruiker in de UI te tonen (naam/rol) en om pagina's client-side te "beveiligen", bv. `account.tsx` doet simpelweg: `if (!session || session.role !== 'customer') return <AccessRestricted/>`.
- Na een geslaagde `authClient.signIn.email`/`signUp.email` roepen `login.tsx`/`register.tsx` ook `setCustomerSession(...)` aan om de localStorage-kopie bij te werken — in de normale flow blijven de twee dus gesynchroniseerd, maar er is geen automatisch mechanisme dat ze bij elkaar houdt (verloopt de servercookie, dan blijft de localStorage-kopie tonen dat je bent ingelogd totdat `clearCustomerSession()` expliciet wordt aangeroepen).
- Bevat ook een **losstaand, dood mock-inlogsysteem** (`DEMO_USERS`, `signInUser`, `registerUser`, `getDemoUsers`, met een tweede localStorage-sleutel `he_registered_users`) dat alleen nog door het eigen testbestand wordt gebruikt — de echte login-/registerpagina's gaan hier niet meer langs. De in de code aanwezige demo-inloggegevens (bv. `customer@healthease.com` / `customer123`) werken dus **niet** meer op het echte inlogformulier.

## 6. API-routes

Bron: `web/src/routes/api/**`, met de eigenlijke Prisma-logica in `web/src/lib/api/*.ts`.

| Route | Methodes | Toegang | Doel |
|---|---|---|---|
| `/api/auth/*` | GET, POST | — | Catch-all naar `auth.handler()` (better-auth: inloggen, registreren, uitloggen, sessie). |
| `/api/db/orders` | GET, POST, PATCH | ingelogd | GET: eigen bestellingen (`?email=`) of apotheek-bestellingen (`?pharmacyId=`, rol pharmacy/admin). POST: rol `customer`, `userEmail`/`email` wordt geforceerd op de ingelogde gebruiker (voorkomt spoofing). PATCH: klant mag alleen naar `cancelled` zetten op eigen bestelling; pharmacy/admin mag elke status zetten. |
| `/api/db/products` | GET, POST, PATCH, DELETE | GET publiek; overige rol `pharmacy` | Producten + voorraad ophalen/aanmaken/bijwerken/verwijderen. |
| `/api/db/reviews` | GET, POST | GET publiek (met `?productId=`); POST rol `customer` | Reviews per product ophalen/plaatsen; naam/e-mail van de reviewer komt van de servergevalideerde sessie, niet van de client. |
| `/api/db/messages` | POST | **publiek, geen sessie vereist** | Contactformulier opslaan — bewust open, koppelt optioneel aan een gebruiker als `userEmail` is meegegeven. |
| `/api/db/notifications` | GET | ingelogd | Laatste 20 meldingen van de ingelogde gebruiker. Als enige route zonder eigen `lib/api/*.ts`-bestand — de Prisma-query staat hier inline, een kleine stijlinconsistentie. |
