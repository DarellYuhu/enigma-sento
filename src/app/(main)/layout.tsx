"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/enigma/app-sidebar";
import { Suspense, useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
// This code is only for TypeScript
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

// This code is for all users

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    window.__TANSTACK_QUERY_CLIENT__ = queryClient;
  }, []);
  return (
    <main>
      <Suspense fallback={"Loading..."}>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="/">Enigma Sento</BreadcrumbLink>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
          </QueryClientProvider>
        </SessionProvider>
      </Suspense>
    </main>
  );
}
