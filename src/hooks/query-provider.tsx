"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { getQueryClient } from "./query-client";

let browserQueryClient: QueryClient | undefined = undefined;

const makeQueryClient = () => {
    if (isServer) {
        return getQueryClient();
    } else {
        if (!browserQueryClient) browserQueryClient = getQueryClient();
        return browserQueryClient;
    }
}

const QueryProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = makeQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default QueryProvider;