import 'dotenv/config'
import { env } from '@/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'postgresql',
    schema: "src/lib/schema/*",
    out: "./drizzle",
    dbCredentials: {
        url: env.DATABASE_URL
    },
    strict: true,
    verbose: true
})