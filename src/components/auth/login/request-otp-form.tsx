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
import {EmailForm} from "@/components/auth/login/email-form";
import {Calendar} from "lucide-react";
import type {z} from "zod";
import {emailLoginSchema} from "@/lib/schemas/auth-schemas";
import {toast} from "sonner";
import {Footer} from "@/components/auth/login/footer";

import {authClient} from "@/lib/auth-client";

export function RequestOtpForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof emailLoginSchema>) => {
        setIsLoading(true);

        try {
            const {error} = await authClient.emailOtp.sendVerificationOtp({
                email: values.email.trim(),
                type: "sign-in",
            });

            if (error) {
                toast.error("Errore nell'invio dell'OTP", {
                    description: "Verifica la tua email e riprova.",
                });
            } else {
                toast.success("OTP inviato con successo", {
                    description: "Controlla la tua email comunicata durante la registrazione.",
                });

                router.push(
                    `/auth/verify-otp?email=${encodeURIComponent(values.email)}`,
                );
            }

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
                        Calendario
                    </CardTitle>

                    <CardDescription className="mt-2 text-sm mb-2">
                        Inserisci la tua email per ricevere il codice OTP.
                    </CardDescription>

                </CardHeader>
                <CardContent>
                    <EmailForm onSubmit={onSubmit} isLoading={isLoading}/>
                </CardContent>
                <CardFooter className="flex justify-center w-full">
                    <Footer />
                </CardFooter>
            </Card>
        </>
    );
}