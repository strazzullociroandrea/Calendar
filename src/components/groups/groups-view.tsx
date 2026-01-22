"use client";

import {api} from "@/trpc/react";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from "@/components/ui/button";
import {Users, Trash2, LogOut, Copy, Check} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {z} from "zod";
import {useState} from 'react';
import {Skeleton} from "@/components/ui/skeleton"


const groupSchema = z.object({
    id: z.string(),
    name: z.string(),
    invitation: z.string().nullable(),
    _count: z.object({
        members: z.number(),
    }),

})

export function GroupsView() {

    const {data: groups, isLoading} = api.groups.getGroups.useQuery();
    const [copiedId, setCopiedId] = useState<string | null>(null);


    const copyInviteCode = async (group: z.infer<typeof groupSchema>) => {
        try {
            await navigator.clipboard.writeText(group.invitation || '');
            setCopiedId(group.id);
        } catch (e) {

        }
    }

    if (isLoading) {
        return (
            <div className="grid   gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="mt-5 shadow-soft border-0 overflow-hidden flex flex-col">
                    {/* Riga colorata più sottile su mobile */}
                    <div className="h-1.5 sm:h-2 bg-muted/20"/>

                    <CardHeader className="p-3 sm:p-4 pb-2">
                        <div className="flex items-start justify-between gap-4">
                            {/* Titolo più corto per non sovrapporsi al tasto */}
                            <Skeleton className="h-5 w-24 sm:h-6 sm:w-32"/>
                            <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-md"/>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4 pt-0 space-y-3">
                        {/* Nascondiamo una riga di descrizione su mobile per risparmiare spazio */}
                        <div className="space-y-2">
                            <Skeleton className="h-3.5 w-full"/>
                            <Skeleton className="h-3.5 w-2/3 hidden sm:block"/>
                        </div>

                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-20 rounded-full"/>
                            <Skeleton className="h-5 w-12 rounded-full"/>
                        </div>

                        {/* Sezione codice più compatta */}
                        <div className="pt-3 border-t border-border/50">
                            <div className="flex items-end justify-between gap-2">
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-2.5 w-16"/>
                                    <Skeleton className="h-7 w-full sm:w-28 rounded"/>
                                </div>
                                <Skeleton className="h-7 w-14 rounded shrink-0"/>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
                                            <code
                                                className="text-sm font-mono font-semibold tracking-widest bg-muted px-2 py-1 rounded">
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
            </div>
        );
}