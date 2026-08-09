import 'dotenv/config' // <-- Voeg deze regel bovenaan toe
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Neon pooler URL is appropriate for the app; migrations need Neon’s direct connection URL.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
})
