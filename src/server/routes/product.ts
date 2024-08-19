import { PriceDiscountTable, ProductTable, StockTraceTable } from "@/lib/schema";
import { createTRPCRouter, protectedRouter } from "@/server/api/trpc";
import { trackType } from "@/types";
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
            const productId = await db.insert(ProductTable).values({ product_name, image, price, stock }).returning({ id: ProductTable.id })
            if (!productId) throw new Error("failed to create")
            const priceTable = await db.insert(PriceDiscountTable).values({ originalPrice, discount, productId: productId[0].id }).returning()
            if (!priceTable) throw new Error("failed to create")
            const stockTrack = db.insert(StockTraceTable).values({ productId: productId[0].id, details: JSON.stringify([{ quantity: stock, createdat: new Date(Date.now()) }]) }).returning()
            if (!stockTrack) throw new Error("failed to create")
            return stockTrack
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
                        pricetable: true,
                        stockdetails: true
                    },
                    limit: pagesize,
                    offset,
                    where: eq(ProductTable.isdeleted, false),
                    orderBy: asc(ProductTable.createdAt),
                })
            }
            return await db.query.ProductTable.findMany({
                with: {
                    pricetable: true,
                    stockdetails: true
                },
                orderBy: asc(ProductTable.createdAt),
                where: eq(ProductTable.isdeleted, false)
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
            add_stock: z.number()
        })).mutation(async ({ input: { id, image, product_name, updatedAt, stock, price, originalPrice, discount, add_stock }, ctx: { db } }) => {
            const updateSid = await db.update(ProductTable).set({ image, product_name, updatedAt, stock, price }).where(eq(ProductTable.id, id)).returning({ id: ProductTable.id });
            if (!updateSid) throw new Error("failed to update")
            const priceTable = await db.update(PriceDiscountTable).set({ updatedAt, discount, originalPrice, productId: id }).where(eq(PriceDiscountTable.productId, id)).returning()
            if (!priceTable) throw new Error("failed to update")
            const stockdetailsstring = await db.query.StockTraceTable.findFirst({ where: eq(StockTraceTable.productId, id), columns: { productId: false } })
            if (!stockdetailsstring) throw new Error("failed to update")
            const stockdetailsjson = JSON.parse(stockdetailsstring.details) as trackType[]
            const newjson = [...stockdetailsjson, { createdat: new Date(Date.now()), quantity: add_stock }]

            if (add_stock > 0) return await db.update(StockTraceTable).set({ details: JSON.stringify(newjson) }).where(eq(StockTraceTable.id, stockdetailsstring.id))
            return updateSid;
        }),
    deleteProduct: protectedRouter.input(z.object({ id: z.string() })).mutation(async ({ input: { id }, ctx: { db } }) => {
        const deleteS = await db.update(ProductTable).set({ stock: 0, isdeleted: true }).where(eq(ProductTable.id, id)).returning();
        if (!deleteS) throw new Error("failed to delete")
        return deleteS
    }),
    fetchProductPages: protectedRouter.input(z.number()).query(async ({ input: pagesize, ctx: { db } }) => {
        let totalProduct = (await db.query.ProductTable.findMany()).length
        return Math.ceil(Number(totalProduct) / pagesize)
    })
})