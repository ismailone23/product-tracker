import { env } from '@/env'
import * as schema from '@/lib/schema'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'


const client = postgres(env.DATABASE_URL, { max: 1 })
export const db = drizzle(client, { schema, logger: true })