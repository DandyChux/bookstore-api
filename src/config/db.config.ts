import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as dotenv from 'dotenv'

dotenv.config();

const client = postgres(process.env.DATABASE_URL!)
const drizzleDB = drizzle(client, { logger: true })

// Run migrations
await migrate(drizzleDB, { migrationsFolder: '../migrations' });

export default drizzleDB