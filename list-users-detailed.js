const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    const res = await pool.query('SELECT email, role, "createdAt" FROM "User" ORDER BY "createdAt" DESC');
    console.log('Current Users:', res.rows);
  } catch (err) {
    console.error('Error listing users:', err);
  } finally {
    await pool.end();
  }
}

main();
