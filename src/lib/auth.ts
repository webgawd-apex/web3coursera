import { createNeonAuth } from '@neondatabase/auth/next/server';

import { prisma } from './prisma';

// Force trusted origins in environment for Better Auth
if (process.env.NEXT_PUBLIC_APP_URL) {
  process.env.BETTER_AUTH_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ].filter(Boolean).join(',');
}

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'http://localhost:3000',
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || 'placeholder-secret-for-build-time-only',
  },
});

export async function getAuthUser() {
  const { data: session } = await auth.getSession();
  return session?.user || null;
}
