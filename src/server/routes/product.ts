import { ProductTable } from "@/lib/schema";
import { createTRPCRouter, protectedRouter } from "@/server/api/trpc";
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
        })
})