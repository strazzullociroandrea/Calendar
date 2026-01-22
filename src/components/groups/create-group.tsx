import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {useState} from 'react';
import {Button} from "@/components/ui/button";
import {Plus, Loader2} from "lucide-react"; // Aggiunto Loader2 per il caricamento
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from '@/components/ui/textarea';
import {z} from "zod";
import {CreateGroupSchema} from '@/lib/schemas/group';
import {api} from '@/trpc/react';
import {toast} from "sonner";


export function CreateGroup({open, setOpen}: { open: boolean; setOpen: (open: boolean) => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const maxDescription = 240;

    const utils = api.useUtils();

    const createGroupMutation = api.groups.createGroup.useMutation({
        onSuccess: async () => {
            await utils.groups.getGroups.invalidate();
            setName('');
            setDescription('');
            setOpen(false);
            toast.success("Gruppo creato con successo!");
        },
        onError: (error) => {
            toast.error("Non è stato possibile creare il gruppo. Riprova più tardi.");
        }
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!name.trim()) return;

        const group: z.infer<typeof CreateGroupSchema> = {
            name,
            description
        };

        createGroupMutation.mutate(group);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:max-w-md bg-white/95 dark:bg-slate-800/90 dark:border dark:border-slate-700/60 text-slate-900 dark:text-slate-50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md border">
                <DialogHeader>
                    <DialogTitle className="font-light text-2xl">Crea Gruppo</DialogTitle>
                </DialogHeader>

                <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="font-light">Nome del gruppo</Label>
                        <Input
                            id="name"
                            value={name}
                            placeholder="Es. Team Marketing"
                            className="font-light bg-white/95 dark:bg-slate-700/60"
                            onChange={(e) => setName(e.target.value)}
                            disabled={createGroupMutation.isPending}
                            required
                        />
                    </div>

                    <div className="space-y-2 mt-4">
                        <Label htmlFor="description" className="font-light">Descrizione</Label>
                        <Textarea
                            id="description"
                            value={description}
                            className="font-light bg-white/95 dark:bg-slate-700/60"
                            onChange={(e) => setDescription(e.target.value.slice(0, maxDescription))}
                            placeholder="Descrivi lo scopo del gruppo"
                            rows={4}
                            disabled={createGroupMutation.isPending}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full gradient-warm text-white font-light"
                        disabled={createGroupMutation.isPending || !name.trim()}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {createGroupMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin"/>
                            ) : (
                                <Plus className="w-4 h-4"/>
                            )}
                            <span>{createGroupMutation.isPending ? "Creazione..." : "Crea Gruppo"}</span>
                        </div>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}