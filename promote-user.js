const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const email = 'omdjr4life@gmail.com';
  try {
    const res = await pool.query('UPDATE "User" SET role = $1 WHERE email = $2', ['ADMIN', email]);
    if (res.rowCount > 0) {
      console.log(`Successfully promoted ${email} to ADMIN`);
    } else {
      console.log(`User ${email} not found`);
    }
  } catch (err) {
    console.error('Error promoting user:', err);
  } finally {
    await pool.end();
  }
}

main();
