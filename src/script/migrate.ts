import 'dotenv/config'
import { env } from "@/env";
import postgres from "postgres";
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from "drizzle-orm/postgres-js";

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });


(async () => {
    await migrate(drizzle(migrationClient), {
        migrationsFolder: 'drizzle'
    })
    await migrationClient.end()
}
)()
