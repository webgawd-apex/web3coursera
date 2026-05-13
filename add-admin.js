const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const email = 'omdjr4life@gmail.com';
  const password = 'onepiece##12';
  const hashedPassword = await bcrypt.hash(password, 10);
  const name = 'Admin User';
  const role = 'ADMIN';

  try {
    // 1. Check if user exists
    const userRes = await pool.query('SELECT id FROM "User" WHERE email = $1', [email]);
    let userId;

    if (userRes.rows.length > 0) {
      userId = userRes.rows[0].id;
      // Update role
      await pool.query('UPDATE "User" SET role = $1 WHERE id = $2', [role, userId]);
      console.log('Updated existing user to ADMIN');
    } else {
      // Create user
      const insertUserRes = await pool.query(
        'INSERT INTO "User" (id, name, email, role, "emailVerified", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [require('crypto').randomUUID(), name, email, role, true, new Date(), new Date()]
      );
      userId = insertUserRes.rows[0].id;
      console.log('Created new ADMIN user');
    }

    // 2. Upsert Account (for Better Auth)
    const accountRes = await pool.query('SELECT id FROM "Account" WHERE "userId" = $1 AND "providerId" = $2', [userId, 'credential']);
    
    if (accountRes.rows.length > 0) {
      await pool.query('UPDATE "Account" SET password = $1 WHERE id = $2', [hashedPassword, accountRes.rows[0].id]);
      console.log('Updated account password');
    } else {
      await pool.query(
        'INSERT INTO "Account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [require('crypto').randomUUID(), userId, email, 'credential', hashedPassword, new Date(), new Date()]
      );
      console.log('Created new account for user');
    }

    console.log('Admin user added successfully!');
  } catch (err) {
    console.error('Error adding admin:', err);
  } finally {
    await pool.end();
  }
}

main();
