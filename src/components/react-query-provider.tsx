"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </div>
  );
};

export default ReactQueryProvider;
