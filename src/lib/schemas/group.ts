import {z} from "zod"

export const CreateGroupSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1).max(240, "La descrizione non può superare i 240 caratteri."),
})