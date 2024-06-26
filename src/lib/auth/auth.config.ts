import { type NextAuthConfig } from "next-auth";
import Github from 'next-auth/providers/github'
import Discord from 'next-auth/providers/discord'

export default {
    providers: [
        Github({ allowDangerousEmailAccountLinking: true }),
        Discord({ allowDangerousEmailAccountLinking: true })
    ]
} satisfies NextAuthConfig