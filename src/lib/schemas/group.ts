import {z} from "zod"

export const CreateGroupSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1).max(240, "La descrizione non può superare i 240 caratteri."),
})

export const deleteGroupSchema = z.object({
    id: z.string().min(1, "Non è stato possibile trovare il gruppo."),
})

export const groupSchema = z.object({
    id: z.string(),
    name: z.string(),
    invitation: z.string().nullable(),
    _count: z.object({
        members: z.number(),
    }),

})

export const joinGroupSchema = z.object({
    invitation: z.string().min(1, "Il codice di invito non può essere vuoto."),
})