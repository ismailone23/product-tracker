import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { eq } from "drizzle-orm";
import { UserTable } from "@/lib/schema";
import { db } from "../db";
import { drizzleAdapter } from "@/lib/drizzle-addapter";

export const { handlers, auth } = NextAuth({
    adapter: drizzleAdapter,
    session: { strategy: "jwt" },
    callbacks: {
        jwt: async ({ token }) => {
            if (!token.sub) {
                return null;
            }
            const refreshedUser = await db.query.UserTable.findFirst({
                where: eq(UserTable.id, token.sub),
                columns: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                },
            });
            if (refreshedUser) {
                token.email = refreshedUser.email;
                token.name = refreshedUser.name;
                token.picture = refreshedUser.image;
            } else {
                return null;
            }
            return token
        },
        session: ({ token, session }) => {
            if (!token.sub) {
                return session
            }
            session.user = {
                id: token.sub,
                email: token.email ?? session.user.email,
                image: token.picture ?? session.user.image,
                emailVerified: session.user.emailVerified,
                name: token.name ?? session.user.name,
            }
            return session
        }
    },
    ...authConfig
})