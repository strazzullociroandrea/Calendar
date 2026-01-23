"use client";

import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Users, Trash2, LogOut, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { z } from "zod";
import { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import { groupSchema } from '@/lib/schemas/group';
import { ConfirmDelete } from "@/components/groups/confirm-delete";
import { toast } from "sonner";
import { ConfirmQuit } from "@/components/groups/confirm-quit";

export function GroupsView() {
    const { data: groups, isLoading } = api.groups.getGroups.useQuery();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [idToQuit, setIdToQuit] = useState<string | null>(null);

    const copyInviteCode = async (group: z.infer<typeof groupSchema>) => {
        try {
            await navigator.clipboard.writeText(group.invitation || '');
            setCopiedId(group.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (e) {
            toast.error("Non è stato possibile copiare il codice invito. Riprovare più tardi.");
        }
    }

    if (isLoading) {
        return (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="mt-5 shadow-soft border-0 overflow-hidden flex flex-col">
                        <div className="h-1.5 sm:h-2 bg-muted/20"/>
                        <CardHeader className="p-3 sm:p-4 pb-2">
                            <div className="flex items-start justify-between gap-4">
                                <Skeleton className="h-5 w-24 sm:h-6 sm:w-32"/>
                                <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-md"/>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 pt-0 space-y-3">
                            <div className="space-y-2">
                                <Skeleton className="h-3.5 w-full"/>
                                <Skeleton className="h-3.5 w-2/3 hidden sm:block"/>
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-20 rounded-full"/>
                                <Skeleton className="h-5 w-12 rounded-full"/>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!groups || groups.length === 0) {
        return (
            <div className="mt-5 text-center py-10 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground">Non sei ancora membro di alcun gruppo.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
                <Card key={group.id} className="mt-5 shadow-soft border-0 overflow-hidden animate-fade-in">
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => {
                                    if (group.invitation) {
                                        setIdToDelete(group.id);
                                    } else {
                                        setIdToQuit(group.id);
                                    }
                                }}
                            >
                                {group.invitation ? (
                                    <Trash2 className="w-4 h-4"/>
                                ) : (
                                    <LogOut className="w-4 h-4"/>
                                )}
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            {group.description}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="gap-1">
                                <Users className="w-3 h-3"/>
                                {group._count.members} {group._count.members === 1 ? "membro" : "membri"}
                            </Badge>
                            {group.invitation && (
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                    Admin
                                </Badge>
                            )}
                        </div>

                        {group.invitation && (
                            <div className="pt-2 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Codice invito</p>
                                        <code className="text-sm font-mono font-semibold tracking-widest bg-muted px-2 py-1 rounded">
                                            {group.invitation}
                                        </code>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyInviteCode(group)}
                                        className="gap-1 font-light"
                                    >
                                        {copiedId === group.id ? (
                                            <Check className="w-4 h-4 text-green-500"/>
                                        ) : (
                                            <Copy className="w-4 h-4"/>
                                        )}
                                        {copiedId === group.id ? 'Copiato!' : 'Copia'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}

             <ConfirmDelete
                open={idToDelete !== null}
                setOpen={(isOpen) => {
                    if (!isOpen) setIdToDelete(null);
                }}
                idToDelete={idToDelete ?? ""}
            />

            <ConfirmQuit
                open={idToQuit !== null}
                setOpen={(isOpen) => {
                    if (!isOpen) setIdToQuit(null);
                }}
                idToDelete={idToQuit ?? ""}
            />
        </div>
    );
}