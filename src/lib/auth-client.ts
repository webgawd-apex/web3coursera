import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL || process.env.NEON_AUTH_BASE_URL || "http://localhost:3000",
    user: {
        additionalFields: {
            role: {
                type: 'string',
            },
        },
    },
})
