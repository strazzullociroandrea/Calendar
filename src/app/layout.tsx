import type {Metadata} from "next";
import {ThemeProvider} from "next-themes";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/react";


export const metadata: Metadata = {
    title: "Calendario",
    description: "A simple calendar webapp.",
    manifest: "/manifest.json",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="it" suppressHydrationWarning>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TRPCReactProvider>
            {children}
            </TRPCReactProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
