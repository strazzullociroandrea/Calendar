import {z} from "zod";

export const emailLoginSchema = z.object({
    email: z.email({message: "Inserisci un indirizzo email valido."}),
});

export const  emailRegisterSchema = z.object({
    name: z.string().min(1, {message: "Il nome e cognome sono obbligatori."}).max(100, {message: "Il campo non può superare i 100 caratteri."}),
    email: z.email({message: "Inserisci un indirizzo email valido."}),
});