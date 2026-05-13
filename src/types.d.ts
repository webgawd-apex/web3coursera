import { auth } from "@/lib/auth";

declare module "better-auth" {
    interface User {
        role: string;
    }
}

declare module "@/lib/auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            emailVerified: boolean;
            image?: string | null;
            createdAt: Date;
            updatedAt: Date;
        }
    }
}
