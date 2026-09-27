const { drizzle } = require('drizzle-orm/mysql2');
const { migrate } = require('drizzle-orm/mysql2/migrator');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

async function main() {
  console.log('Running migrations...');
  try {
    const connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL,
      multipleStatements: true
    });
    const db = drizzle(connection);
    await migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle_migrations') });
    console.log('Migrations complete.');
    await connection.end();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}
main();
