import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL || process.env.NEON_AUTH_BASE_URL || "https://ep-still-heart-all06k2a.neonauth.c-3.eu-central-1.aws.neon.tech/neondb/auth" // the base url of your auth server
})
