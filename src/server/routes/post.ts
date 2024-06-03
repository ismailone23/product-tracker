import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
    hello: publicProcedure.query(async () => {
        return {
            message: "hello from trpc"
        }
    })
})