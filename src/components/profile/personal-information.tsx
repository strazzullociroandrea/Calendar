"use client";

import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Input} from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {api} from "@/trpc/react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {authClient} from "@/lib/auth-client";

const formSchema = z.object({
    name: z.string().min(3, "Minimo 3 caratteri").max(100),
    email: z.string().email(),
});

export function PersonalInformation() {
    const {data: session, refetch} = authClient.useSession();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            name: session?.user.name ?? "",
            email: session?.user.email ?? "",
        },
    });
    const onSubmit = (values: z.infer<typeof formSchema>) => updateProfile.mutate(values);

    const updateProfile = api.profile.updateProfile.useMutation({
        onSuccess: async () => {
            await refetch();
            toast.success("Profilo aggiornato");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return (
        <section aria-labelledby="personal-info-title" className="mx-auto max-w-5xl px-4">
            <Card>
                <CardHeader>
                    <CardTitle id="personal-info-title" className="font-light text-lg">Informazioni personali</CardTitle>
                    <p className="text-sm text-muted-foreground">Gestisci il tuo nome e le informazioni pubbliche del profilo.</p>
                </CardHeader>
                <CardContent>
                    <div className="max-w-3xl space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback aria-hidden>
                                    {session?.user.name
                                        ? session.user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                        : "NA"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="text-base font-light truncate">{session?.user.name ?? "Nome Utente"}</p>
                                <p className="text-sm text-neutral-500 font-light truncate">{session?.user.email ?? "email@example.com"}</p>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-live="polite">
                                <div className="grid grid-cols-1 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="font-light">Nome completo</FormLabel>
                                                <FormControl>
                                                    <Input {...field} aria-label="Nome completo" />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="font-light">Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled
                                                        aria-disabled
                                                        className="bg-neutral-50 font-light text-neutral-500 cursor-not-allowed"
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                                <p className="text-sm text-muted-foreground">Nota: l’email è collegata all’account e non può essere modificata qui.</p>
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <div className="flex justify-end">
                                    <Button variant="secondary" type="submit" className="w-full sm:w-auto" disabled={updateProfile.isPending} aria-disabled={updateProfile.isPending}>
                                        {updateProfile.isPending ? "Salvataggio..." : "Salva modifiche"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}