import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { productRouter } from "./product";

export const appRouter = createTRPCRouter({
    product: productRouter,
    hello: publicProcedure.query(async () => {
        return {
            message: "hello from trpc"
        }
    })
})

export type AppRouter = typeof appRouter