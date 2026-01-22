import type React from "react";
import {Toaster} from "@/components/ui/sonner";
import {TRPCReactProvider} from "@/trpc/react";
import {SidebarProvider} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import {getServerSession} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function Layout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {

    const session = await getServerSession();

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <TRPCReactProvider>
            <SidebarProvider>
                <AppSidebar/>
                <main className="w-full md:ml-72 h-screen overflow-auto  p-4 pt-16 md:pt-4 pb-24">
                    {children}
                    <Toaster position="bottom-right" richColors/>
                </main>
            </SidebarProvider>
        </TRPCReactProvider>
    );
}