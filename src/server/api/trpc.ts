import { Context } from '@/trpc/context'
import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
            }
        }
    }
})

export const createTRPCRouter = t.router;

export const protectMiddleware = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" })
    return next()
})

export const publicProcedure = t.procedure
export const protectedRouter = t.procedure.use(protectMiddleware)