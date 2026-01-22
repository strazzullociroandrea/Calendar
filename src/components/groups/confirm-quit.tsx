import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {api} from "@/trpc/react";
import {toast} from "sonner";

export function ConfirmQuit({open, setOpen, idToDelete}: {
    open: boolean;
    setOpen: (open: boolean) => void,
    idToDelete: string
}) {

    const utils = api.useUtils();

    const quitMutation = api.groups.quitGroup.useMutation({
        onSuccess: async () => {
            await utils.groups.getGroups.invalidate();
            toast.success("Gruppo abbandonato con successo.");
            setOpen(false);
        },
        onError: (error) => {
            toast.error(error.message);
            setOpen(false);
        }
    });

    const handleQuit = (e: React.FormEvent) => {
        e.preventDefault();

        quitMutation.mutate({id: idToDelete});
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:max-w-md bg-white/95 dark:bg-slate-800/90 dark:border dark:border-slate-700/60 text-slate-900 dark:text-slate-50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md border">
                <DialogHeader>
                    <DialogTitle className="font-light text-2xl">Conferma Abbandono</DialogTitle>
                </DialogHeader>
                <form className="space-y-4 mt-2">
                    <div className="space-y-4 mt-2">
                        <h3 className="text-sm font-light text-center">
                            Sei sicuro di voler abbandonare questo gruppo?
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
                                onClick={handleQuit}
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