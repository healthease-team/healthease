# HealthEase Backend

Express + Prisma + MySQL API for the HealthEase web app.

## What this backend does

- Serves products, categories, reviews, pharmacies, and orders
- Handles customer registration and login with JWT authentication
- Supports pharmacy dashboard actions
- Accepts prescription and ID card uploads for orders
- Seeds demo data for local development

## Tech stack

- Node.js
- Express
- Prisma
- MySQL
- JWT
- Multer

## Project structure

```text
backend/
|- prisma/
|  |- schema.prisma
|  |- seed.js
|- scripts/
|  |- create_database.sql
|  |- setup.ps1
|- uploads/
|- server.js
|- package.json
```

## Requirements

- Node.js
- MySQL running locally
- A database named `healthease_db`

## Environment variables

Create a `backend/.env` file.

You can copy the example file:

```bash
cp .env
```

Example values:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/healthease_db"
JWT_SECRET="dev_secret_key"
PORT=4000
```

## Installation

From the `backend/` folder:

```bash
cd backend
npm install
```

## Database setup

### 1. Create the database

Use MySQL Workbench, phpMyAdmin, or the MySQL CLI.

You can also run the SQL file in:

`scripts/create_database.sql`

### 2. Run the first Prisma migration

```bash
npx prisma migrate dev --name init
```

### 3. Seed demo data

```bash
npm run seed
```

The seed script creates:

- demo products and stock
- pharmacies
- user accounts
- sample reviews

## Demo login accounts

After seeding, you can use these accounts:

- Pharmacy: `central@healtease.test` / `pharmacy123`
- Customer: `user@healtease.test` / `user123`

## Run the API

```bash
npm run dev
```

The API runs on:

`http://localhost:4000`

Health check: Run this in PostMan:

`GET http://localhost:4000/api/health`

## Main API routes

### Public routes

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id/stock`
- `GET /api/categories`
- `GET /api/reviews`
- `GET /api/pharmacies`
- `POST /api/contact`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/reviews`

### Protected routes

These require `Authorization: Bearer <token>`.

- `GET /api/pharmacies/:id/stock`
- `GET /api/pharmacies/:id/orders`
- `GET /api/orders/:id`
- `GET /api/users/:id/orders`
- `PATCH /api/orders/:id/status`
- `PATCH /api/pharmacies/:id/stock`
- `POST /api/orders`

## Order upload notes

Creating an order requires these file fields:

- `prescription`
- `idCard`

Uploads are stored in:

`backend/uploads/`

## Useful scripts

- `npm run dev` - start the API
- `npm run seed` - seed the database


## Prisma commands

Useful during development:

```bash
npx prisma studio
npx prisma generate
npx prisma migrate dev --name init
```

## Known behavior

- New orders are currently routed to `Central Pharmacy` by business rule in `server.js`
- Delivery orders require customer coordinates
- Delivery is rejected if the distance is more than 15 km

## Troubleshooting

### Prisma cannot connect to MySQL

Check:

- MySQL is running
- `DATABASE_URL` is correct
- the database exists

### Seed fails

Run these again:

```bash
npx prisma migrate dev --name init
npm run seed
```

### Port already in use

Change `PORT` in `.env` and restart the server.
