---
title: Project- en mappenstructuur
description: Routing-conventies, componentenindeling, state management en styling van de web-app.
---

Dit deel gaat over hoe de code in `web/src/` is opgebouwd: routing, componenten, state management en styling.

## Inhoudsopgave

1. [Routing](#1-routing)
2. [Componentenindeling](#2-componentenindeling)
3. [State management (React contexts)](#3-state-management-react-contexts)
4. [Styling](#4-styling)

---

## 1. Routing

De app gebruikt **TanStack Router** met **file-based routing**: elk bestand onder `web/src/routes/` wordt automatisch een route.

### Routeboom

```
web/src/routes/__root.tsx                        # HTML-shell + globale providers
web/src/routes/_site.tsx                          # layout: Navbar + Footer (geen eigen pad)
web/src/routes/_site/index.tsx                     → /
web/src/routes/_site/shop.tsx                      → /shop
web/src/routes/_site/essentials.tsx                → /essentials
web/src/routes/_site/products/$productId.tsx       → /products/:productId
web/src/routes/_site/checkout.tsx                  → /checkout
web/src/routes/_site/contact.tsx                   → /contact
web/src/routes/_site/faq.tsx                       → /faq
web/src/routes/_site/terms.tsx                     → /terms
web/src/routes/_site/testimonials.tsx              → /testimonials
web/src/routes/_auth.tsx                           # layout: gecentreerde auth-kaart (geen eigen pad)
web/src/routes/_auth/login.tsx                     → /login
web/src/routes/_auth/register.tsx                  → /register
web/src/routes/account.tsx                         → /account
web/src/routes/admin.tsx                           → /admin
web/src/routes/pharmacy.dashboard.tsx              → /pharmacy/dashboard
web/src/routes/api/auth/$.ts                        → /api/auth/*  (catch-all naar better-auth)
web/src/routes/api/db/orders.ts                      → /api/db/orders
web/src/routes/api/db/products.ts                     → /api/db/products
web/src/routes/api/db/reviews.ts                      → /api/db/reviews
web/src/routes/api/db/messages.ts                     → /api/db/messages
web/src/routes/api/db/notifications.ts                → /api/db/notifications
```

### Conventies

- **`_site` en `_auth` zijn pathless layout-routes** ("route groups"): het onderstrepingsteken betekent dat het segment geen deel wordt van de URL, alleen van de mapstructuur. `_site.tsx` omhult zijn kind-routes met `Navbar`, `Footer` en de globale `LocationsModal`; `_auth.tsx` omhult `login`/`register` met een gecentreerde kaartlayout.
- **`account`, `admin` en `pharmacy.dashboard` staan bewust buiten `_site`**: deze drie hebben elk hun eigen header (`AccountHeader`, `AdminHeader`, `DashboardHeader`) in plaats van de publieke `Navbar`/`Footer`. Ga er dus niet vanuit dat elke pagina dezelfde chrome heeft.
- **`pharmacy.dashboard.tsx` gebruikt platte "punt"-naamgeving** (`pharmacy.dashboard.tsx` → `/pharmacy/dashboard`) in plaats van een submap zoals bij `_site/products/$productId.tsx`. Beide zijn geldige TanStack Router-conventies, maar de menging kan verwarren bij het scannen van de bestandsboom.
- **API-routes** (`web/src/routes/api/**`) zijn ook file-based routes, maar exporteren request-handlers per HTTP-methode via `createFileRoute(...)({ server: { handlers: { GET, POST, ... } } } )`. Ze leunen op `web/src/lib/api/*.ts` voor de eigenlijke Prisma-logica (zie [Data & authenticatie](/technisch/data-en-auth/)).
- **Toegangscontrole** op `account`/`admin`/`pharmacy.dashboard` gebeurt vandaag met een simpele component-check op `getCustomerSession()` (client-only, zie [Data & authenticatie](/technisch/data-en-auth/)) — geen `beforeLoad`-routeguard en geen check tegen de echte server-sessie op paginaniveau.

### `routeTree.gen.ts`

`web/src/routeTree.gen.ts` is **automatisch gegenereerd** — bovenaan staat letterlijk "You should NOT make any changes in this file". Het wordt bijgewerkt door:

- `pnpm generate-routes` (→ `tsr generate`, configuratie in `web/tsr.config.json`), of
- automatisch tijdens `pnpm dev` / `pnpm build` via de `tanstackStart()`-Vite-plugin.

In de normale workflow hoef je dit dus nooit handmatig te draaien; het bestand hoort wel gecommit te blijven, anders faalt een verse `vite build` op typecontrole.

## 2. Componentenindeling

```
web/src/components/
├── (top-level)     Navbar.tsx, Footer.tsx, Hero.tsx, CategoryCard.tsx, ProductCard.tsx,
│                    ShopSearch.tsx, AuthCard.tsx, AccountHeader.tsx, AdminHeader.tsx,
│                    CheckoutForm.tsx, OrderSummary.tsx, ContactForm.tsx, ReviewForm.tsx,
│                    ReviewCard.tsx, OrderHistoryList.tsx, NotificationsList.tsx, LocationsModal.tsx
├── ui/              Button.tsx, Modal.tsx, ThemeToggle.tsx, ProductDetailModal.tsx,
│                    ProductGrid.tsx, StarRating.tsx, Accordion.tsx, StatusBadge.tsx
└── dashboard/       DashboardHeader.tsx, StockManager.tsx, RecentOrders.tsx,
                     NewItemModal.tsx, OrderDetailsModal.tsx, OrderDocsModal.tsx
```

- **Top-level `components/`** — pagina-/feature-specifieke componenten, meestal aan één of twee routes gebonden (headers per rol, formulieren, widgets als `Navbar`/`Footer`/`Hero`).
- **`components/ui/`** — generieke, herbruikbare presentatiecomponenten zonder route-specifieke logica (`Button`, `Modal`, `Accordion`, `StarRating`, `StatusBadge`, `ThemeToggle`). `ProductDetailModal` en `ProductGrid` staan hier ook, omdat ze op meerdere pagina's (shop, essentials, home) herbruikt worden — de grens tussen `components/` en `components/ui/` is dus eerder "herbruikt over meerdere routes" dan "generiek vs. domeinspecifiek".
- **`components/dashboard/`** — alles specifiek voor het apotheekdashboard, consumeert `useDashboardData()` (zie hieronder). Ter vergelijking: `AdminHeader`/`AccountHeader` kregen géén eigen submap — een kleine inconsistentie in de indeling.
- `web/components.json` configureert shadcn/ui-conventies (aliassen `components`→`#/components`, `ui`→`#/components/ui`, `hooks`→`#/hooks`) — let op: er bestaat momenteel geen `web/src/hooks/`-map, die alias is dus (nog) ongebruikt.

## 3. State management (React contexts)

Alle contexts volgen hetzelfde patroon: `createContext<T | null>(null)` plus een `use___()`-hook die een fout gooit buiten de bijbehorende provider.

| Context (`web/src/lib/`) | Beheert | Geprovide in | Gebruikt door (voorbeelden) |
|---|---|---|---|
| `cart-context.tsx` | Winkelwagen (`CartItem[]`), `addItem`/`removeItem`/`updateQuantity`/`clearCart`, `itemCount`/`bagTotal`. Persisteert naar `localStorage` (`he_cart`). | `__root.tsx` (globaal) | `Navbar`, `OrderSummary`, `CheckoutForm`, `ProductGrid` |
| `toast-context.tsx` | Tijdelijke meldingen (`showToast`), auto-verdwijnen na 3s. | `__root.tsx` (globaal) | `CheckoutForm`, `ContactForm`, `OrderHistoryList`, `ReviewForm`, `ProductGrid`, `admin.tsx` |
| `theme-context.tsx` | Licht/donker-thema, persisteert naar `localStorage` (`he_theme`), zet de `dark`-klasse op `<html>`. | `__root.tsx` (buitenste provider) | `ThemeToggle` |
| `locations-modal-context.tsx` | Open/dicht-status van de "Locations"-modal. | `__root.tsx` (globaal) | `Navbar`, `Hero`, `LocationsModal` |
| `dashboard-context.tsx` | Apotheekdashboard-data: `products`, `stock`, `orders`, `searchTerm`, plus async CRUD (`addProduct`/`updateProduct`/`deleteProduct`/`updateOrderStatus`) die de `/api/db/products`- en `/api/db/orders`-routes aanroepen. Hardcodet `CURRENT_PHARMACY_ID = 'ph1'` (zie [Bekende aandachtspunten](/technisch/aandachtspunten/)). | Alleen lokaal rond `pharmacy.dashboard.tsx` | `StockManager`, `RecentOrders`, `NewItemModal`, `DashboardHeader` |

Twee losse modules zijn **géén** React-context, maar module-level state — belangrijk om niet te verwarren met de bovenstaande:

- **`checkout-draft.ts`** — een plain module-scoped variabele (`let draft = {}`) met `getCheckoutDraft`/`saveCheckoutDraft`/`clearCheckoutDraft`, gebruikt om formulierstatus tussen checkout-stappen te bewaren. Niet reactief (geen re-render bij wijziging) en, omdat het module-state is, potentieel gedeeld tussen server-requests bij SSR — alleen veilig te gebruiken als clientside, transiënte state.
- **`customer-auth.ts`** — plain functies rond een `localStorage`-sessie (zie [Data & authenticatie](/technisch/data-en-auth/) voor het volledige verhaal).

Providervolgorde in `web/src/routes/__root.tsx`:

```
ThemeProvider > CartProvider > ToastProvider > LocationsModalProvider > {children}
```

## 4. Styling

- **Tailwind CSS v4** via de `@tailwindcss/vite`-plugin — er is **geen `tailwind.config.js/ts`**; de configuratie is CSS-first en staat volledig in `web/src/styles.css`.
- `web/src/styles.css` bevat:
  - `@custom-variant dark (&:where(.dark, .dark *));` — activeert `dark:`-varianten op basis van een `.dark`-klasse op `<html>` (bijgehouden door `theme-context.tsx` plus een inline "no-flash"-script in `__root.tsx`).
  - Een `@theme { ... }`-blok met de eigen design tokens, automatisch beschikbaar als Tailwind-klassen: kleuren als `--color-brand-navy`, `--color-mint`, `--color-mint-light`, `--color-accent-blue`, `--color-link-blue`, `--color-page-bg`, `--color-surface`, `--color-text-muted(-2)`; plus lettertype, schaduwen (`--shadow-card`, `--shadow-card-hover`) en animaties (`--animate-fade-in`, `--animate-fade-in-up`).
  - Een `.dark { ... }`-blok dat **dezelfde variabelenamen herdefinieert** met andere waarden — dit is het mechanisme waardoor klassen als `bg-page-bg`/`text-brand-navy` overal automatisch thema-bewust zijn, zonder dat je `dark:`-prefixen op elke losse plek hoeft te zetten.
- `web/src/lib/ui-classes.ts` bundelt een paar herhaalde Tailwind-classnames (`inputClass`, `labelClass`, `cardClass`) die in formulieren worden hergebruikt.
- Twee icoon-bronnen zijn in gebruik: `bootstrap-icons` (via CSS-klassen, bv. `bi bi-cart3`) en `lucide-react` (React-componenten) — geen harde regel welke waar wordt gebruikt.
