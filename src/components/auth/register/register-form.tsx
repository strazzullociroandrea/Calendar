"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {EmailForm} from "@/components/auth/register/email-form";
import {Calendar} from "lucide-react";
import type {z} from "zod";
import {emailRegisterSchema} from "@/lib/schemas/auth-schemas";
import {toast} from "sonner";
import {Footer} from "@/components/auth/register/footer";
import {authClient} from "@/lib/auth-client";

export function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof emailRegisterSchema>) => {
        setIsLoading(true);

        try {

            await authClient.signUp.email({
                email: values.email.trim(),
                name: values.name.trim(),
                password: Math.random().toString(36).slice(-10) + "Aa1!",
            }, {
                onRequest: () => {
                    setIsLoading(true);
                },
                onSuccess: () => {
                    setIsLoading(false);
                    toast.success("Registrazione avvenuta con successo.", {
                        description: "Controlla la tua email per verificare l'account.",
                    });

                    setTimeout(() => router.push("/"), 3000);
                },
                onError: (ctx) => {
                    setIsLoading(false);
                    toast.error("Errore nell'invio dell'OTP", {
                        description: "Verifica la tua email e riprova.",
                    });
                },
            });
        } catch (error) {
            toast.error("Si è verificato un errore improvviso.", {
                description: "Non è stato possibile inviare l'OTP. Riprova più tardi.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Card
                className="w-full max-w-md mx-auto mt-8 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
                <CardHeader className="text-center">
                    <div
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-yellow-500 shadow-md">
                        <Calendar className="h-8 w-8 "/>
                    </div>

                    <CardTitle className="text-2xl font-semibold tracking-tight ">
                        Crea Account
                    </CardTitle>

                    <CardDescription className="mt-2 text-sm mb-2">
                        Inizia a organizzare i tuoi eventi
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    <EmailForm onSubmit={onSubmit} isLoading={isLoading}/>
                </CardContent>
                <CardFooter className="flex justify-center w-full">
                    <Footer/>
                </CardFooter>
            </Card>
        </>
    );
}