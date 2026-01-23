import {useState} from 'react';
import {authClient} from "@/lib/auth-client";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from "sonner";
import {Loader2, Plus, UserPlus} from 'lucide-react';
import {api} from "@/trpc/react";

export const JoinGroup = ({open, setOpen}: { open: boolean; setOpen: (open: boolean) => void }) => {
    const [code, setCode] = useState('');

    const utils = api.useUtils();

    const joinGroupMutation = api.groups.joinGroup.useMutation({
        onSuccess: async () => {
            await utils.groups.getGroups.invalidate();
            setOpen(false);
            toast.success("Fai ora parte al gruppo!");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        joinGroupMutation.mutate({invitation: code.trim()});
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-2rem)] sm:max-w-md bg-white/95 dark:bg-slate-800/90 dark:border dark:border-slate-700/60 text-slate-900 dark:text-slate-50 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-md border">
                <DialogHeader>
                    <DialogTitle className=" text-2xl font-light">Unisciti a un Gruppo</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="code" className="font-light">Codice invito</Label>
                        <Input
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Es. MKT123"
                            className="text-center font-light  tracking-widest "
                            maxLength={6}
                            required
                        />
                        <p className="text-sm font-light text-muted-foreground">
                            Inserisci il codice invito che hai ricevuto dal creatore del gruppo.
                        </p>
                    </div>
                    <Button
                        type="submit"
                        className="mt-2 w-full gradient-warm text-white font-light"
                        disabled={joinGroupMutation.isPending || !code.trim()}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {joinGroupMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin"/>
                            ) : (
                                <Plus className="w-4 h-4"/>
                            )}
                            <span>{joinGroupMutation.isPending ? "Caricamento..." : "Unisciti"}</span>
                        </div>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};