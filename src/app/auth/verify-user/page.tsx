"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar, Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hasCalled = useRef(false);
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        token ? "loading" : "error"
    );

    useEffect(() => {
        if (!token || hasCalled.current) return;
        hasCalled.current = true;

        authClient.verifyEmail({
            query: { token: token }
        }, {
            onSuccess: () => {
                setStatus("success");
            },
            onError: () => {
                setStatus("error");
            }
        });
    }, [token, router]);

    return (
        <Card
            className="w-full max-w-md mx-auto mt-8 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
            <CardHeader className="text-center">
                {/* ICONA CON LO STESSO GRADIENTE DEL TUO FORM */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-yellow-500 shadow-md">
                    {status === "loading" && <Loader2 className="h-8 w-8 animate-spin text-white" />}
                    {status === "success" && <CheckCircle2 className="h-8 w-8 text-white" />}
                    {status === "error" && <XCircle className="h-8 w-8 text-white" />}
                </div>

                <CardTitle className="text-2xl font-semibold tracking-tight">
                    {status === "loading" && "Verifica in corso"}
                    {status === "success" && "Account Verificato"}
                    {status === "error" && "Errore di Verifica"}
                </CardTitle>

                <CardDescription className="mt-2 text-sm mb-2">
                    {status === "loading" && "Stiamo confermando i tuoi dati, un momento..."}
                    {status === "success" && "Email confermata con successo! Puoi chiudere la pagina e tornare al sito."}
                    {status === "error" && "Il link è scaduto o non è valido. Riprova a registrarti."}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-center">
                {status === "error" && (
                    <button
                        onClick={() => router.push("/auth/register")}
                        className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
                    >
                        Torna alla registrazione
                    </button>
                )}
            </CardContent>
        </Card>
    );
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Suspense fallback={
                <Card className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg border border-slate-200 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </Card>
            }>
                <VerifyContent />
            </Suspense>
        </div>
    );
}