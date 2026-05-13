const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const email = 'omdjr4life@gmail.com';
  const password = 'onepiece##12';
  const name = 'Admin User';
  const role = 'ADMIN';

  try {
    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'user_' + Math.random().toString(36).substring(2, 15);
    const accountId = 'acc_' + Math.random().toString(36).substring(2, 15);

    // 2. Insert User
    await pool.query(
      'INSERT INTO "User" (id, email, name, role, "updatedAt") VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (email) DO UPDATE SET role = $4, "updatedAt" = NOW()',
      [userId, email, name, role]
    );

    // Get the actual userId (in case it already existed)
    const userRes = await pool.query('SELECT id FROM "User" WHERE email = $1', [email]);
    const actualUserId = userRes.rows[0].id;

    // 3. Insert Account (or update password if exists)
    await pool.query(
      'INSERT INTO "Account" (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET password = $5, "updatedAt" = NOW()',
      [accountId, actualUserId, email, 'credential', hashedPassword]
    );

    console.log(`Successfully added/updated admin user: ${email}`);
  } catch (err) {
    console.error('Error adding admin user:', err);
  } finally {
    await pool.end();
  }
}

main();
