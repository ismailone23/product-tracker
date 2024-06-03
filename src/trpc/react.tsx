"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { api } from "./shared";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import SuperJSON from "superjson";


const createQueryClient = () => new QueryClient()

let clientQueryClientSingleton: QueryClient | undefined = undefined;

const getQueryClient = () => {
    if (typeof window === "undefined") {
        return createQueryClient()
    }
    return clientQueryClientSingleton ?? createQueryClient()
}

export function TRPCProvider({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient()
    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                loggerLink({
                    enabled: (op) =>
                        process.env.NODE_ENV === "development" ||
                        (op.direction === 'down' && op.result instanceof Error),

                }),
                unstable_httpBatchStreamLink({
                    transformer: SuperJSON,
                    url: getBaseURL() + '/api/trpc',
                    headers: () => {
                        const headers = new Headers();
                        headers.set("x-trpc-source", "nextjs-react");
                        return headers;
                    },
                })
            ]
        })
    )
    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider client={trpcClient} queryClient={queryClient}>
                {children}
            </api.Provider>
        </QueryClientProvider>
    );
}
function getBaseURL() {
    if (typeof window !== "undefined") return window.location.origin;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
}