"use client";

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {Button} from "@/components/ui/button";
import {ArrowLeft, ArrowRight, Loader2, ShieldCheck} from "lucide-react";
import {toast} from "sonner";
import {authClient} from "@/lib/auth-client";


type VerifyOtpFormProps = {
    email: string;
};

export function VerifyOtpForm({email}: VerifyOtpFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");

    const goBack = () => {
        router.push("/auth/login");
    };
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Codice OTP incompleto", {
                description: "Inserisci tutte e 6 le cifre del codice.",
            });
            return;
        }

        setIsLoading(true);

        try {

            const {error} = await authClient.signIn.emailOtp({
                email: email.trim(),
                otp: otp,
            });

            if (error) {
                toast.error("Codice non valido", {
                    description: error.message || "Il codice inserito è errato o scaduto.",
                });
                return;
            }

            toast.success("Accesso effettuato!", {
                description: "Ti stiamo reindirizzando alla home.",
            });

            setTimeout(() => router.push("/auth/login"), 3000);

            router.refresh();

        } catch (error) {
            console.error("Errore durante la verifica OTP:", error);
            toast.error("Si è verificato un errore", {
                description: "Non è stato possibile verificare il codice. Riprova più tardi.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div
                    className="bg-gradient-to-br from-orange-400 to-yellow-500   mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck className="size-8 stroke-white "/>
                </div>
                <CardTitle className="text-2xl">Inserisci il codice OTP</CardTitle>
                <CardDescription className="font-light">
                    Abbiamo inviato un codice di 6 cifre a{" "}
                    <strong className="font-medium text-foreground">{email}</strong>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-8">
                    <div className="flex justify-center">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={setOtp}
                            disabled={isLoading}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot className="size-10 md:size-14" index={0}/>
                                <InputOTPSlot className="size-10 md:size-14" index={1}/>
                                <InputOTPSlot className="size-10 md:size-14" index={2}/>
                            </InputOTPGroup>
                            <InputOTPSeparator/>
                            <InputOTPGroup>
                                <InputOTPSlot className="size-10 md:size-14" index={3}/>
                                <InputOTPSlot className="size-10 md:size-14" index={4}/>
                                <InputOTPSlot className="size-10 md:size-14" index={5}/>
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <Button
                        type="submit"
                        className="w-full gap-2 bg-gradient-to-br from-orange-400 to-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-orange-500"
                        size="lg"
                        disabled={isLoading || otp.length !== 6}
                    >

                        {isLoading ? (
                            <>
                                <Loader2 className="size-5 animate-spin"/>
                                Verifica in corso...
                            </>
                        ) : (
                            <>
                                Verifica e Accedi
                                <ArrowRight className="size-5"/>
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-4 border-t pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={goBack}
                    disabled={isLoading}
                    className="gap-2 text-muted-foreground"
                >
                    <ArrowLeft className="size-4"/>
                    Usa un&apos;altra email
                </Button>
            </CardFooter>
        </Card>
    );
}
