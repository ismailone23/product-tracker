import { ProductTable } from "@/lib/schema";
import { createTRPCRouter, protectedRouter } from "@/server/api/trpc";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

export const productRouter = createTRPCRouter({
    createStock: protectedRouter.input(
        z.object({
            product_name: z.string(),
            price: z.coerce.number().gt(0, { message: "Please enter a number greater than 0" }),
            stock: z.number(), image: z.string()
        })).mutation(async ({ input: { image, product_name, price, stock }, ctx: { db } }) => {
            const newStock = await db.insert(ProductTable).values({ product_name, image, price, stock }).returning()
            if (!newStock) throw new Error("failed to create")
            return newStock
        }),
    getProduct: protectedRouter.input(z.object({ title: z.string().nullable(), id: z.string().nullable() })).query(async ({ input: { title, id }, ctx: { db } }) => {
        console.log(title, id)
        return await db.select().from(ProductTable).orderBy(asc(ProductTable.createdAt))
    }),
    updateProduct: protectedRouter.input(
        z.object({
            id: z.string(),
            product_name: z.string(),
            price: z.coerce.number().gt(0, { message: "Please enter a number greater than 0" }),
            stock: z.number(),
            image: z.string(),
            updatedAt: z.date(),
        })).mutation(async ({ input: { id, image, product_name, updatedAt, stock, price }, ctx: { db } }) => {
            const updateS = await db.update(ProductTable).set({ image, product_name, updatedAt, stock, price }).where(eq(ProductTable.id, id)).returning();
            if (!updateS) throw new Error("failed to update")
            return updateS
        }),
    deleteProduct: protectedRouter.input(z.object({ id: z.string() })).mutation(async ({ input: { id }, ctx: { db } }) => {
        const deleteS = await db.update(ProductTable).set({ stock: 0 }).where(eq(ProductTable.id, id)).returning();
        if (!deleteS) throw new Error("failed to delete")
        return deleteS
    })
})