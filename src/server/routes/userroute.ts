import { UserTable } from "@/lib/schema";
import { createTRPCRouter, protectedRouter } from "@/server/api/trpc";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const userRouter = createTRPCRouter({
    getUser: protectedRouter.input(z.object({ email: z.string().optional() })).query(async ({ input: { email }, ctx: { db } }) => {
        if (email) return await db.query.UserTable.findMany({ where: eq(UserTable.email, email) })
        return await db.query.UserTable.findMany({ orderBy: desc(UserTable.createdAt) })
    }),
    updateUser: protectedRouter.input(z.object({ id: z.string(), role: z.string() })).mutation(async ({ input: { id, role }, ctx: { db } }) => {
        return await db.update(UserTable).set({ role: role as "OWNER" | "ADMIN" | "MEMBER" }).where(eq(UserTable.id, id))
    }),
    deleteUser: protectedRouter.input(z.object({ id: z.string() })).mutation(async ({ input: { id }, ctx: { db } }) => {
        return await db.delete(UserTable).where(eq(UserTable.id, id));
    })
})