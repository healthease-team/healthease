# HealthEase — Web App.

De HealthEase webapp: een apotheek-/gezondheidsplatform gebouwd met [TanStack Start](https://tanstack.com/start) en React. De app bedient drie rollen:

- **Klant** — producten bekijken, bestellen, reviews plaatsen, account- en orderoverzicht (`/account`).
- **Apotheek** — bestellingen en voorraad beheren via het apotheek-dashboard (`/pharmacy/dashboard`).
- **Admin** — gebruikersbeheer en platformbeheer (`/admin`, `/admin/users`).

Voor uitgebreidere uitleg per rol, zie de gebruikers- en technische handleiding in de [`docs/`](../docs) map (Starlight-site).

## 🧱 Tech stack

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (file-based routing, server functions, API routes)
- [TanStack Query](https://tanstack.com/query) voor data fetching
- React 19, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/)-componenten
- [Better Auth](https://www.better-auth.com) voor authenticatie
- [Prisma](https://www.prisma.io) als ORM, PostgreSQL (Neon) als database
- [Vitest](https://vitest.dev/) voor tests, [Biome](https://biomejs.dev/) voor linting/formatting
- Nitro als server-adapter (draait op elke Node-compatibele host)

## 🚀 Installation
1. Navigate to the web directory:
```bash
cd web
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure .env.local using .env.example as a guide[cite: 1].

4. Deploy database schema and seed demo data:

```bash
pnpm exec prisma migrate deploy
pnpm db:seed
```

5. Run the web app locally:

```bash
pnpm dev
```

## Prerequisites
- Node.js 20+[cite: 1]
- pnpm[cite: 1]
- Neon PostgreSQL connection string[cite: 1]


### Environment variables

Kopieer [`.env.example`](.env.example) naar `.env.local` en vul de waarden in:

| Variabele | Omschrijving |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL/Neon connection string die de app gebruikt. |
| `DIRECT_URL` | Neon non-pooler hostname, nodig voor Prisma migrations. |
| `BETTER_AUTH_SECRET` | Lang random secret voor Better Auth (`pnpm dlx @better-auth/cli secret`). |
| `BETTER_AUTH_URL` | Publieke app-URL (`http://localhost:3000` lokaal). |

### Database (Prisma)

Het Prisma-schema staat in [`prisma/schema.prisma`](prisma/schema.prisma), migrations in [`prisma/migrations/`](prisma/migrations/).

```bash
pnpm dlx prisma migrate dev   # migrations lokaal toepassen / aanmaken
pnpm dlx prisma generate      # Prisma client opnieuw genereren
pnpm dlx prisma db seed       # database seeden (zie prisma/seed.ts)
```

> ⚠️ De `db:generate` / `db:push` / `db:migrate` / `db:studio` / `db:pull` scripts in `package.json` zijn Drizzle-commando's die zijn overgebleven uit de TanStack Start-template. Ze worden niet actief gebruikt in dit project — Prisma is de daadwerkelijke ORM (zie `src/lib/prisma.ts` en `src/lib/api/*`).

### Dev server starten

```bash
pnpm dev
```

## 🧞 Scripts

| Command | Actie |
| :--- | :--- |
| `pnpm dev` | Start de lokale dev server op `localhost:3000` |
| `pnpm build` | Bouwt de productie-app |
| `pnpm preview` | Preview van de build lokaal |
| `pnpm test` | Draait de tests met Vitest |
| `pnpm lint` | Linten met Biome |
| `pnpm format` | Formatteren met Biome |
| `pnpm check` | Lint + format check met Biome |

## 📁 Projectstructuur

```
web/
├── prisma/              # Prisma schema, migrations, seed
├── src/
│   ├── routes/           # File-based routes (TanStack Router), incl. admin.*, pharmacy.dashboard.tsx, account.tsx, api/
│   ├── components/        # UI-componenten (admin/, dashboard/, ui/, en algemene componenten)
│   ├── lib/                # auth, prisma client, api-helpers (lib/api/*), contexts (cart, dashboard, theme, toast)
│   ├── db/                 # database-gerelateerde helpers
│   └── generated/prisma/    # gegenereerde Prisma client
├── vite.config.ts
└── package.json
```

## ✅ Testen

Tests draaien met Vitest:

```bash
pnpm test
```

Zie bijvoorbeeld [`src/lib/customer-auth.test.ts`](src/lib/customer-auth.test.ts) als voorbeeld van een bestaande test.
