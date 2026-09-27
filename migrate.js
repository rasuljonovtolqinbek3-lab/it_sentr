const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
const path = require('path');
require('dotenv').config();

async function main() {
  console.log('Running migrations on PostgreSQL...');
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is missing in environment variables');
    }
    
    // max: 1 connection for migrations
    const migrationClient = postgres(connectionString, { max: 1 });
    const db = drizzle(migrationClient);
    
    await migrate(db, { migrationsFolder: path.join(__dirname, 'lib/db/migrations') });
    console.log('Migrations complete.');
    await migrationClient.end();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

main();
