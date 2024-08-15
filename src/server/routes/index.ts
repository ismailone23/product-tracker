import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { productRouter } from "./product";
import { invoiceRouter } from "./invoices";

export const appRouter = createTRPCRouter({
    product: productRouter,
    invoice: invoiceRouter,
    hello: publicProcedure.query(async () => {
        return {
            message: "hello from trpc"
        }
    })
})

export type AppRouter = typeof appRouter