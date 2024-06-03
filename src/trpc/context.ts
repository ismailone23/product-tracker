import { NextRequest } from "next/server";

const createTRPCContext = async (opts: { headers: Headers }) => {
    return {
        ...opts
    }
}
export const createContext = async (req: NextRequest) => createTRPCContext({ headers: req.headers })

export type Context = typeof createTRPCContext;