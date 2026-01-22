import type { z } from "zod";
import { emailRegisterSchema } from "@/lib/schemas/auth-schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail, Info, User } from "lucide-react"; // Aggiunto User icon
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type EmailFormProps = {
    onSubmit: (values: z.infer<typeof emailRegisterSchema>) => Promise<void>;
    isLoading: boolean;
};

export function EmailForm({ onSubmit, isLoading }: EmailFormProps) {
    const form = useForm<z.infer<typeof emailRegisterSchema>>({
        resolver: zodResolver(emailRegisterSchema),
        defaultValues: {
            email: "",
            name: ""
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-sm mx-auto space-y-4">
                {/* CAMPO NOME */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                        const hasError = !!form.formState.errors.name;
                        return (
                            <FormItem>
                                <FormControl>
                                    <div className="relative w-full">
                                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 size-5 transition-colors ${hasError ? "text-destructive" : "text-muted-foreground"}`} />

                                        {hasError && (
                                            <TooltipProvider delayDuration={150}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-destructive cursor-help" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">{form.formState.errors.name?.message}</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}

                                        <Input
                                            {...field}
                                            placeholder="Il tuo nome e cognome"
                                            disabled={isLoading}
                                            className={`pl-10 h-12 text-base transition-all ${hasError ? "border-destructive pr-10" : ""}`}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        );
                    }}
                />

                {/* CAMPO EMAIL + BOTTONE */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => {
                        const hasError = !!form.formState.errors.email;
                        return (
                            <FormItem>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-full">
                                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 size-5 transition-colors ${hasError ? "text-destructive" : "text-muted-foreground"}`} />

                                            {hasError && (
                                                <TooltipProvider delayDuration={150}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-destructive cursor-help" />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">{form.formState.errors.email?.message}</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}

                                            <Input
                                                {...field}
                                                placeholder="Email"
                                                type="email"
                                                disabled={isLoading}
                                                className={`pl-10 h-12 text-base transition-all ${hasError ? "border-destructive pr-10" : ""}`}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="icon"
                                            className="h-12 w-12 flex-shrink-0 bg-linear-to-br from-orange-400 to-yellow-500 shadow-sm"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="size-5 animate-spin stroke-white"/> : <ArrowRight className="size-5 stroke-white"/>}
                                        </Button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        );
                    }}
                />
            </form>
        </Form>
    );
}