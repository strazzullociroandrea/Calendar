"use client";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from "@/components/ui/button";
import {api} from "@/trpc/react";
import {toast} from "sonner";
import {useRouter} from 'next/navigation';
import {authClient} from "@/lib/auth-client";

export function ConfirmDeleteAccount({open, setOpen}: {
    open: boolean;
    setOpen: (open: boolean) => void,
}) {

    const router = useRouter();
    const utils = api.useUtils();


    const deleteMutation = api.profile.deleteProfile.useMutation({
        onSuccess: async () => {
            await utils.groups.getGroups.invalidate();
            toast.success("Profilo eliminato con successo. Sarai reindirizzato alla pagina iniziale.");
            setOpen(false);
            setTimeout(async () => {
                await authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/auth/login");
                        },
                    },
                });
            }, 3000);
        },
        onError: (error) => {
            toast.error(error.message);
            setOpen(false);
        }
    });

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        deleteMutation.mutate();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:max-w-md bg-white/95 dark:bg-slate-800/90 dark:border dark:border-slate-700/60 text-slate-900 dark:text-slate-50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md border">
                <DialogHeader>
                    <DialogTitle className="font-light text-2xl">Conferma eliminazione</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-2">
                    <div className="space-y-4 mt-2">
                        <h3 className="text-sm font-light text-center">
                            Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.
                            Tutti i tuoi dati, inclusi i gruppi che hai creato, saranno permanentemente rimossi.
                        </h3>

                        <div className="flex items-center justify-center gap-3 mt-6">
                            <Button
                                variant="outline"
                                className="px-6 py-2 font-light rounded-md bg-muted hover:bg-muted/80"
                                onClick={() => setOpen(false)}
                            >
                                Annulla
                            </Button>
                            <Button
                                variant="destructive"
                                className="px-6 py-2 font-light rounded-md"
                                onClick={handleDelete}
                            >
                                Conferma
                            </Button>
                        </div>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}