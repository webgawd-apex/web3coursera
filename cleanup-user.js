const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const email = 'omdjr4life@gmail.com';
  try {
    await pool.query('DELETE FROM "Account" WHERE "accountId" = $1', [email]);
    await pool.query('DELETE FROM "User" WHERE email = $1', [email]);
    console.log('Cleaned up user successfully');
  } catch (err) {
    console.error('Error cleaning up:', err);
  } finally {
    await pool.end();
  }
}

main();
