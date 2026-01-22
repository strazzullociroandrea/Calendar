import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button";

function parseUserAgent(ua?: string) {
    const s = ua || "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(s);

    let os = "Sconosciuto";
    if (/Android/i.test(s)) os = "Android";
    else if (/iPhone|iPad|iPod|iOS/i.test(s)) os = "iOS";
    else if (/Windows NT/i.test(s)) os = "Windows";
    else if (/Macintosh|Mac OS X/i.test(s)) os = "macOS";
    else if (/Linux/i.test(s)) os = "Linux";

    let browser = "Sconosciuto";
    if (/Edg\//i.test(s)) browser = "Edge";
    else if (/OPR|Opera/i.test(s)) browser = "Opera";
    else if (/Chrome\//i.test(s) && !/Edg\//i.test(s) && !/OPR/i.test(s)) browser = "Chrome";
    else if (/Firefox\//i.test(s)) browser = "Firefox";
    else if (/Safari\//i.test(s) && !/Chrome\//i.test(s)) browser = "Safari";

    return {
        deviceType: isMobile ? "Telefono/Tablet" : "Desktop",
        os,
        browser,
        raw: s,
    };
}

function isLikelySameDevice(sessionUA?: string, currentUA?: string) {
    if (!sessionUA || !currentUA) return false;

    // Compare important tokens: OS family and browser family
    const sess = parseUserAgent(sessionUA);
    const cur = parseUserAgent(currentUA);

    // If both OS and browser match, consider it the same device
    if (sess.os !== "Sconosciuto" && cur.os !== "Sconosciuto" && sess.os === cur.os && sess.browser === cur.browser) {
        return true;
    }

    // If raw UAs are identical (best case)
    if (sessionUA === currentUA) return true;

    // Fallback: if many tokens overlap
    const a = sessionUA.split(/\s|\)|\(|;|\//).filter(Boolean);
    const b = currentUA.split(/\s|\)|\(|;|\//).filter(Boolean);
    const common = a.filter((t) => b.includes(t));
    return common.length >= 4;
}

function formatDateIso(date?: unknown) {
    if (!date) return "Sconosciuto";
    try {
        let d: Date;
        if (typeof date === "string") d = new Date(date);
        else if (date instanceof Date) d = date;
        else if (typeof date === "object") d = new Date((date as { toString(): string }).toString());
        else return String(date);
        return d.toLocaleString();
    } catch {
        return String(date);
    }
}

export function PersonalSession() {

    const utils = api.useContext();

    const { data: sessions, isLoading } = api.profile.getSession.useQuery();

    const [revokingId, setRevokingId] = useState<string | null>(null);

    const revoke = api.profile.revokeSession.useMutation({
        async onMutate({ id }) {
            setRevokingId(id);
        },
        onSuccess() {
            utils.profile.getSession.invalidate();
        },
        onSettled() {
            setRevokingId(null);
        }
    });

    const currentUA = typeof navigator !== "undefined" ? navigator.userAgent : undefined;

    const enhanced = useMemo(() => {
        return (sessions || []).map((s) => {
            const parsed = parseUserAgent(s.userAgent ?? undefined);
            const isCurrent = isLikelySameDevice(s.userAgent ?? undefined, currentUA);
            return {
                ...s,
                parsed,
                isCurrent,
            };
        });
    }, [sessions, currentUA]);

    if (isLoading) return(
        <div className="mx-auto max-w-3xl mt-5 px-4">
            <Card>
                <CardHeader>
                    <CardTitle id="sessions-title" className="font-light text-lg">Le mie sessioni attive</CardTitle>
                </CardHeader>
                <CardContent aria-busy="true">
                    <div className="flex flex-col items-center justify-center gap-3 py-6">
                        <Spinner />
                        <div className="text-sm text-muted-foreground">Caricamento delle sessioni...</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
    if (!sessions || sessions.length === 0) return (
        <div className="mx-auto max-w-3xl mt-5 px-4">
            <Card>
                <CardHeader>
                    <CardTitle id="sessions-title-empty" className="font-light text-lg">Le mie sessioni attive</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="py-6 text-center text-sm text-muted-foreground" role="status" aria-live="polite">Nessuna sessione attiva trovata.</div>
                </CardContent>
            </Card>
        </div>
    );

    const handleRevoke = async (id: string) => {
        const ok = confirm("Sei sicuro di voler revocare questa sessione?");
        if (!ok) return;
        try {
            await revoke.mutateAsync({ id });
        } catch (e) {
            console.error(e);
            alert("Errore durante la revoca della sessione.");
        }
    }

    return (
        <div className="mx-auto max-w-3xl mt-5 px-4">
            <Card>
                <CardHeader>
                    <CardTitle id="sessions-title" className="font-light text-lg">Le mie sessioni attive</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul role="list" className="space-y-4">
                        {enhanced.map((session) => (
                            <li key={session.id} role="listitem">
                                <div className="p-4 border rounded-lg bg-background">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <div className="text-sm font-medium truncate">{session.parsed.deviceType} • {session.parsed.os}</div>
                                                <div className="text-xs text-muted-foreground">{session.parsed.browser}</div>
                                                {session.isCurrent && (
                                                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 text-green-800 text-xs px-2 py-0.5">
                                                        Questo dispositivo
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2 text-sm text-foreground">
                                                <strong>IP:</strong> {session.ipAddress ?? "Sconosciuto"}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                <strong>Ultimo accesso:</strong> {formatDateIso(session?.updatedAt ?? session?.createdAt)}
                                            </div>
                                            <div className="mt-2 text-xs text-muted-foreground break-all max-w-full">
                                                <strong>ID:</strong> <span className="inline-block sm:ml-1">{session.id}</span>
                                            </div>
                                        </div>

                                        <div className="shrink-0 sm:w-40 flex items-center sm:items-start justify-end gap-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full sm:w-auto"
                                                disabled={session.isCurrent || revokingId === session.id}
                                                aria-label={`Revoca sessione ${session.id}`}
                                                onClick={() => handleRevoke(session.id)}
                                            >
                                                {revokingId === session.id ? "Revocando..." : "Revoca"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}