import type { Adapter } from "@auth/core/adapters";
import { AccountsTable, SessionsTable, UserTable, VerificationTokensTable } from "./schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export const drizzleAdapter: Adapter = {
    async createSession({ expires, sessionToken, userId }) {
        const [session] = await db
            .insert(SessionsTable)
            .values({ expires, sessionToken, userId })
            .returning();
        if (!session) {
            throw new Error("Failed to create session");
        }
        return session;
    },
    async createUser({ email, emailVerified, image, name }) {
        const [user] = await db
            .insert(UserTable)
            .values({ email, emailVerified, image, name: name as string })
            .returning();
        if (!user) {
            throw new Error("Failed to create user");
        }
        return user;
    },
    async createVerificationToken(token) {
        const [verificationToken] = await db
            .insert(VerificationTokensTable)
            .values(token)
            .returning();
        return verificationToken ?? null;
    },
    async deleteSession(sessionToken) {
        const [session] = await db
            .delete(SessionsTable)
            .where(eq(SessionsTable.sessionToken, sessionToken))
            .returning();
        return session ?? null;
    },
    async deleteUser(userId) {
        await db.delete(UserTable).where(eq(UserTable.id, userId)).returning();
    },
    async getSessionAndUser(sessionToken) {
        const [session] = await db
            .select({
                session: SessionsTable,
                user: UserTable,
            })
            .from(SessionsTable)
            .where(eq(SessionsTable.sessionToken, sessionToken))
            .innerJoin(UserTable, eq(UserTable.id, SessionsTable.userId));
        return session ?? null;
    },
    async getUser(userId) {
        const [user] = await db.select().from(UserTable).where(eq(UserTable.id, userId));
        return user ?? null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
        const [account] = await db
            .select({ user: UserTable })
            .from(AccountsTable)
            .where(
                and(
                    eq(AccountsTable.providerAccountId, providerAccountId),
                    eq(AccountsTable.provider, provider),
                ),
            )
            .innerJoin(UserTable, eq(AccountsTable.userId, UserTable.id));
        if (!account) {
            return null;
        }
        return account.user;
    },
    async getUserByEmail(email) {
        const [user] = await db.select().from(UserTable).where(eq(UserTable.email, email));
        return user ?? null;
    },
    async linkAccount({
        provider,
        providerAccountId,
        type,
        userId,
        access_token,
        expires_at,
        id_token,
        refresh_token,
        scope,
        token_type,
    }) {
        const [account] = await db
            .insert(AccountsTable)
            .values({
                accessToken: access_token,
                expiresAt: expires_at,
                idToken: id_token,
                provider,
                providerAccountId,
                refreshToken: refresh_token,
                scope,
                tokenType: token_type,
                type,
                userId,
            })
            .returning();
        if (!account) {
            throw new Error("Failed to link account!");
        }
        return {
            access_token: account.accessToken ?? undefined,
            authorization_details: undefined,
            expires_at: account.expiresAt ?? undefined,
            id_token: account.idToken ?? undefined,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refreshToken ?? undefined,
            scope: account.scope ?? undefined,
            token_type: account.tokenType ?? undefined,
            type: account.type,
            userId: account.userId,
        };
    },
    async unlinkAccount({ provider, providerAccountId }) {
        const [account] = await db
            .delete(AccountsTable)
            .where(
                and(
                    eq(AccountsTable.providerAccountId, providerAccountId),
                    eq(AccountsTable.provider, provider),
                ),
            )
            .returning();
        if (!account) {
            throw new Error("Account not found!");
        }
        return {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            type: account.type,
            userId: account.userId,
        };
    },
    async updateSession({ expires, userId, sessionToken }) {
        const [session] = await db
            .update(SessionsTable)
            .set({ expires, sessionToken, userId })
            .where(eq(SessionsTable.sessionToken, sessionToken))
            .returning();
        if (!session) {
            throw new Error("Session not found!");
        }
        return session;
    },
    async updateUser({ id: userId, email, emailVerified, image, name }) {
        const [user] = await db
            .update(UserTable)
            .set({ email, emailVerified, image, name: name as string })
            .where(eq(UserTable.id, userId))
            .returning();
        if (!user) {
            throw new Error("User not found!");
        }
        return user;
    },
    async useVerificationToken({ identifier, token }) {
        const [verificationToken] = await db
            .delete(VerificationTokensTable)
            .where(
                and(
                    eq(VerificationTokensTable.identifier, identifier),
                    eq(VerificationTokensTable.token, token),
                ),
            )
            .returning();
        if (!verificationToken) {
            throw new Error("Verification Token not found!");
        }
        return verificationToken;
    }
};
