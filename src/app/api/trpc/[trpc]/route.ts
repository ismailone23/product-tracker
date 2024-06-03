import { NextRequest } from "next/server";
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from "@/server/routes";
import { createContext } from "@/trpc/context";
import { env } from "@/env";

const handler = (req: NextRequest) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => createContext(req),
        onError:
            env.NODE_ENV === "development"
                ? ({ path, error }) => {
                    console.error(
                        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
                    );
                }
                : undefined,
    });

export { handler as GET, handler as POST };
