import { PriceDiscountTable, ProductTable } from "@/lib/schema";
import { createTRPCRouter, protectedRouter } from "@/server/api/trpc";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
export const productRouter = createTRPCRouter({
    createStock: protectedRouter.input(
        z.object({
            product_name: z.string(),
            stock: z.number(),
            image: z.string(),
            price: z.number().gt(0, { message: "Please enter a number greater than 0" }),
            originalPrice: z.number().gt(0, { message: "Please enter a number greater than 0" }),
            discount: z.number().lt(100, { message: "Please enter less than 100%" }).optional(),
        })).mutation(async ({ input: { image, product_name, price, originalPrice, discount, stock }, ctx: { db } }) => {
            const newStockId = await db.insert(ProductTable).values({ product_name, image, price, stock }).returning({ id: ProductTable.id })
            if (!newStockId) throw new Error("failed to create")
            const priceTable = await db.insert(PriceDiscountTable).values({ originalPrice, discount, productId: newStockId[0].id })
            if (!priceTable) throw new Error("failed to create")
            return priceTable
        }),
    getProduct: protectedRouter
        .input(z.object({
            page: z.number().gt(0, { message: "must be greater than 0" }).optional(),
            pagesize: z.number().min(6).max(10).optional()
        }))
        .query(async ({ input: { page, pagesize }, ctx: { db } }) => {
            if (page && pagesize) {
                const offset = (page - 1) * pagesize;
                return await db.query.ProductTable.findMany({
                    with: {
                        extra: {
                            columns: {
                                createdAt: false,
                                updatedAt: false
                            }
                        }
                    },
                    limit: pagesize,
                    offset,
                    orderBy: asc(ProductTable.createdAt),
                })
            }
            return await db.query.ProductTable.findMany({
                with: {
                    extra: {
                        columns: {
                            createdAt: false,
                            updatedAt: false
                        }
                    }
                },
                orderBy: asc(ProductTable.createdAt)
            })
        }),
    updateProduct: protectedRouter.input(
        z.object({
            id: z.string(),
            product_name: z.string().optional(),
            price: z.number().gt(0, { message: "Please enter a number greater than 0" }).optional(),
            originalPrice: z.number().gt(0, { message: "Please enter a number greater than 0" }).optional(),
            discount: z.number().lt(100, { message: "Please enter less than 100%" }).optional(),
            stock: z.number().optional(),
            image: z.string().optional(),
            updatedAt: z.date(),
        })).mutation(async ({ input: { id, image, product_name, updatedAt, stock, price, originalPrice, discount, }, ctx: { db } }) => {
            const updateSid = await db.update(ProductTable).set({ image, product_name, updatedAt, stock, price }).where(eq(ProductTable.id, id)).returning({ id: ProductTable.id });
            if (!updateSid) throw new Error("failed to update")
            const priceTable = await db.update(PriceDiscountTable).set({ updatedAt, discount, originalPrice, productId: id }).where(eq(PriceDiscountTable.productId, id)).returning()
            if (!priceTable) throw new Error("failed to update")

            return priceTable;
        }),
    deleteProduct: protectedRouter.input(z.object({ id: z.string() })).mutation(async ({ input: { id }, ctx: { db } }) => {
        const deleteS = await db.update(ProductTable).set({ stock: 0 }).where(eq(ProductTable.id, id)).returning();
        if (!deleteS) throw new Error("failed to delete")
        return deleteS
    }),
    fetchProductPages: protectedRouter.input(z.number()).query(async ({ input: pagesize, ctx: { db } }) => {
        let totalProduct = (await db.query.ProductTable.findMany()).length
        return Math.ceil(Number(totalProduct) / pagesize)
    })
})