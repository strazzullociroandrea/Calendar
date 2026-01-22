import {Button} from "@/components/ui/button";

export function DangerZone() {

    return (
        <section aria-labelledby="danger-zone-title" className="mx-auto max-w-3xl px-4">

            <div className="p-4 mt-6 border border-red-200 rounded-lg bg-red-50" role="region"
                 aria-labelledby="danger-zone-title">
                <h2 id="danger-zone-title" className="text-lg font-medium text-red-700 mb-2">Zona Pericolosa</h2>
                <p className="text-sm text-red-600 mb-4">
                    Attenzione: l&apos;azione di cancellazione &egrave; irreversibile. Procedi con cautela.
                </p>
                <div className="flex justify-center">
                    <Button type="button" variant="destructive" onClick={() => {
                        alert("Funzionalit&agrave; di eliminazione del profilo non ancora implementata.");
                    }}
                            className="w-full sm:w-auto">
                        Elimina profilo
                    </Button>
                </div>
            </div>
        </section>
    );
}