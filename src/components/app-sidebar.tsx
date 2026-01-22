"use client";

import { useState } from "react";
import { Home, Calendar, Mail, Settings, Users, Menu, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Gruppi", url: "/groups", icon: Users },
    { title: "Notifiche", url: "/notifies", icon: Mail, badge: 2 },
    { title: "Profilo", url: "/profile", icon: Settings },
];

export function AppSidebar() {
    const pathname = usePathname() ?? "/";
    const router = useRouter();
    const [open, setOpen] = useState(false);

    // Sessione reale da Better-Auth
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const getInitials = (name?: string) => {
        if (!name) return "??";
        const parts = name.split(" ");
        return parts.map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/auth/login");
                },
            },
        });
    };

    return (
        <div className="relative">
            {/* Mobile Navbar - Usa bg-sidebar per coerenza */}
            <nav className="md:hidden fixed top-0 left-0 right-0 z-40 border-b border-sidebar-border bg-sidebar/80 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl brand-gradient flex items-center justify-center text-white shadow-sm">
                        <Calendar className="h-4 w-4" />
                    </div>
                    <span className="font-light text-xl tracking-tight text-sidebar-foreground">Calendario</span>
                </div>

                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors"
                >
                    <Menu className="h-6 w-6 text-sidebar-foreground" />
                </button>
            </nav>

            {/* Sidebar Principale - bg-sidebar si adatta al Dark Mode di globals.css */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-30 w-72 h-full min-h-screen transform bg-sidebar transition-transform duration-300 border-r border-sidebar-border",
                    open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full p-6 pt-20 md:pt-8 gap-8">

                    {/* Desktop Header */}
                    <div className="hidden md:flex items-center gap-3 px-2">
                        <div className="h-10 w-10 rounded-2xl brand-gradient flex items-center justify-center text-white shadow-lg">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <span className="text-2xl font-light text-sidebar-foreground tracking-tight">Calendario</span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex flex-col gap-1.5 flex-1">
                        {items.map((item) => {
                            const active = pathname === item.url;
                            return (
                                <Link
                                    key={item.title}
                                    href={item.url}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-light transition-all group",
                                        active
                                            ? "sidebar-link-active shadow-sm"
                                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5 transition-colors",
                                        active ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                                    )} />
                                    <span className="flex-1 hover: text-white">{item.title}</span>

                                    {item.badge && (
                                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Card Footer */}
                    <div className="mt-auto pt-4 border-t border-sidebar-border">
                        {isPending ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-sidebar-accent/30 border border-sidebar-border shadow-sm group  ">
                                <div className="h-11 w-11 rounded-full brand-gradient flex items-center justify-center text-white text-sm font-medium shadow-sm flex-shrink-0">
                                    {getInitials(user?.name)}
                                </div>

                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-[13px] font-medium text-sidebar-foreground truncate">
                                        {user?.name || "Utente"}
                                    </span>
                                    <span className="text-[11px] text-sidebar-foreground/50 truncate">
                                        {user?.email}
                                    </span>
                                </div>

                                <button
                                    onClick={handleSignOut}
                                    className="p-2 rounded-xl hover:bg-destructive/10 text-sidebar-foreground/40 hover:text-destructive transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Backdrop */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="md:hidden fixed inset-0 bg-background/40 backdrop-blur-[2px] z-20 transition-opacity"
                />
            )}
        </div>
    );
}