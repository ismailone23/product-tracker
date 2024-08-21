import { type NextAuthConfig } from "next-auth";
import Google from 'next-auth/providers/google'
// import Discord from 'next-auth/providers/discord'

export default {
    providers: [
        Google({ allowDangerousEmailAccountLinking: true }),
        // Discord({ allowDangerousEmailAccountLinking: true })
    ]
} satisfies NextAuthConfig