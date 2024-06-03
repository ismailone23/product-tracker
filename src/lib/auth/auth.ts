import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, auth } = NextAuth({
    session: { strategy: "jwt" },
    callbacks: {
        jwt: async ({ token }) => {
            if (!token.sub) {
                return null
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