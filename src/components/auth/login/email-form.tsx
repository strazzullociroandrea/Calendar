import type { z } from "zod";
import { emailLoginSchema } from "@/lib/schemas/auth-schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,

} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type EmailFormProps = {
    onSubmit: (values: z.infer<typeof emailLoginSchema>) => Promise<void>;
    isLoading: boolean;
};

export function EmailForm({ onSubmit, isLoading }: EmailFormProps) {
    const form = useForm<z.infer<typeof emailLoginSchema>>({
        resolver: zodResolver(emailLoginSchema),
        defaultValues: {
            email: "",
        },
    });

    const hasError = !!form.formState.errors.email;
    const errorMessage = form.formState.errors.email?.message; // Prendi il messaggio di errore

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-sm mx-auto"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-start gap-2">
                                    <div className="relative w-full">
                                        {/* Icona Mail */}
                                        <Mail
                                            className={`absolute left-3 top-1/2 -translate-y-1/2 size-5 transition-colors ${
                                                hasError ? "text-destructive" : "text-muted-foreground"
                                            }`}
                                        />

                                        {/* Icona Info con Tooltip - Appare solo se c'è un errore */}
                                        {hasError && errorMessage && (
                                            <TooltipProvider delayDuration={150}> {/* Aggiunto delayDuration per una migliore UX */}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-destructive cursor-help"
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-xs p-2 text-sm">
                                                        {errorMessage}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}

                                        <Input
                                            {...field}
                                            placeholder="Il tuo indirizzo email"
                                            type="email"
                                            autoComplete="email"
                                            disabled={isLoading}
                                            className={`pl-10 h-12 text-base transition-all ${
                                                hasError
                                                    ? "border-destructive focus-visible:ring-destructive ring-offset-transparent pr-10" // Aggiunto pr-10 per lasciare spazio all'icona Info
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="h-12 w-12 flex-shrink-0 bg-linear-to-br from-orange-400 to-yellow-500"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="size-5 animate-spin stroke-white"/>
                                        ) : (
                                            <ArrowRight className="size-5 stroke-white"/>
                                        )}
                                        <span className="sr-only">Invia OTP</span>
                                    </Button>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}