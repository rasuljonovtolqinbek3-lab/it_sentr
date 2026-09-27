import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Prevent hot reload from creating multiple connections
declare global {
  var mysqlConnection: mysql.Connection | undefined;
}

let connection: mysql.Connection;

async function getConnection() {
  if (global.mysqlConnection) {
    return global.mysqlConnection;
  }
  
  const conn = await mysql.createConnection(process.env.DATABASE_URL || 'mysql://user:pass@localhost:3306/dbname');
  
  if (process.env.NODE_ENV !== 'production') {
    global.mysqlConnection = conn;
  }
  return conn;
}

// In Next.js App Router, some route handlers use the db object directly without waiting for a promise.
// Drizzle supports a connection pool.
const pool = mysql.createPool(process.env.DATABASE_URL || 'mysql://user:pass@localhost:3306/dbname');

export const db = drizzle(pool, { schema, mode: 'default' });
