const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const targetEmail = 'omdjr4life@gmail.com';
  try {
    // Search for users containing 'omdjr' and 'life'
    const res = await pool.query("SELECT id, email FROM \"User\" WHERE email ILIKE '%omdjr%life%'");
    console.log('Found matching users:', res.rows);

    if (res.rows.length > 0) {
      for (const user of res.rows) {
        await pool.query('UPDATE "User" SET role = $1 WHERE id = $2', ['ADMIN', user.id]);
        console.log(`Promoted ${user.email} to ADMIN`);
      }
    } else {
      console.log('No matching users found.');
    }
  } catch (err) {
    console.error('Error promoting users:', err);
  } finally {
    await pool.end();
  }
}

main();
