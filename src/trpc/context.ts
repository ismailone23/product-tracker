import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { NextRequest } from "next/server";

const createTRPCContext = async (opts: { headers: Headers }) => {
    const session = await auth()
    return {
        db,
        session,
        ...opts
    }
}
export const createContext = async (req: NextRequest) => createTRPCContext({ headers: req.headers })

export type Context = typeof createTRPCContext;