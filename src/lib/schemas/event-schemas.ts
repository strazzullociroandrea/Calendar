import {z} from "zod";

export const eventSchemas = z.object({
    title: z.string().min(1, {message: "Inserisci un titolo per l'evento."}).max(100, {message: "Il titolo non può superare i 100 caratteri."}),
    details: z.string({message: "Inserisci una descrizione per l'evento."}).optional(),
    when: z.string()
        .min(10, {message: "Campo obbligatorio."})
});