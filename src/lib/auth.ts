import { createNeonAuth } from '@neondatabase/auth/next/server';

import { prisma } from './prisma';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'STUDENT',
      },
    },
  },
});

export async function getAuthUser() {
  const { data: session } = await auth.getSession();
  return session?.user || null;
}
