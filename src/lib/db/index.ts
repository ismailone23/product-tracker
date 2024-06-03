import { env } from '@/env'
import * as schema from '@/lib/schema'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'


export type DB = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
    db: DB | undefined;
};

const client = postgres(env.DATABASE_URL, { max: 1 })

export const db = globalForDb.db ?? drizzle(client, { schema });

if (env.NODE_ENV !== "production") {
    globalForDb.db = db;
}
