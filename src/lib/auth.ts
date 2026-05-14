import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    secret: process.env.BETTER_AUTH_SECRET || process.env.NEON_AUTH_COOKIE_SECRET || "a-very-secure-fallback-secret-for-build-time",
    trustedOrigins: [
        'http://localhost:3000',
        process.env.NEXT_PUBLIC_APP_URL || '',
    ].filter(Boolean),
    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'student',
            },
        },
    },
});

export async function getAuthUser() {
  // Better Auth standard getSession requires passing headers/context in some environments
  // but in Next.js it usually handles it via next/headers internally or we can pass them.
  // For simplicity in server components/actions:
  try {
    const { headers } = await import("next/headers");
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user || null;
  } catch (e) {
    return null;
  }
}
