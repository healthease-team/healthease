## Backend setup (Prisma + MySQL)

This backend uses the existing Prisma schema at `prisma/schema.prisma`.

### 0) Create the database (one time)

Create a MySQL database named `healthease_db`.

You can run `scripts/create_database.sql` in MySQL Workbench / phpMyAdmin / mysql CLI.

### 1) Create `backend/.env`

Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL`.

Example:

```bash
DATABASE_URL="mysql://root:yourpassword@localhost:3306/healthease_db"
JWT_SECRET="dev_secret_key"
PORT=4000
```

### 2) Install deps

```bash
npm install
```

### 3) Create DB tables (first time)

If this is a new database:

```bash
npx prisma db push
```

### 4) Seed demo data

```bash
npm run seed
```

### Quick setup (PowerShell)

From `backend/` you can run:

```powershell
.\scripts\setup.ps1 -DatabaseUrl "mysql://root:yourpassword@localhost:3306/healthease_db"
```

### 5) Run API

```bash
npm run dev
```

API will be on `http://localhost:4000`.
