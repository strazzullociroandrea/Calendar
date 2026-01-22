import {redirect} from "next/navigation";
import {Toaster} from "@/components/ui/sonner";
import { getServerSession } from "@/lib/auth";

export default async function Layout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await getServerSession();

    if (session) {
        redirect("/");
    }


    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
            <Toaster position="top-center" richColors/>
            <main className="flex flex-1 items-center justify-center p-4">
                {children}
            </main>
        </div>
    );
}