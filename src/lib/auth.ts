import { createNeonAuth } from '@neondatabase/auth/next/server';

import { prisma } from './prisma';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'http://localhost:3000',
  trustedOrigins: [
    'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || '',
  ].filter(Boolean),
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET || 'placeholder-secret-for-build-time-only',
  },
});

export async function getAuthUser() {
  const { data: session } = await auth.getSession();
  return session?.user || null;
}
