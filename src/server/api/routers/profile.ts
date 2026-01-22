import {z} from "zod";
import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {TRPCError} from "@trpc/server";

export const profileRouter = createTRPCRouter({
    updateProfile: protectedProcedure
        .input(
            z.object({
                name: z.string().min(3).max(100),
                email: z.string().email(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const userId = ctx.session.user.id;

            const emailExists = await ctx.db.user.findFirst({
                where: {
                    email: input.email,
                    NOT: {id: userId},
                },
            });

            if (emailExists) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Email già in uso.",
                });
            }

            return ctx.db.user.update({
                where: {id: userId},
                data: {
                    name: input.name,
                    email: input.email,
                    emailVerified: false,
                },
            });
        }),
    getSession: protectedProcedure
        .query(async ({ctx}) => {
            const userId = ctx.session.user.id;

            const user = await ctx.db.user.findUnique({
                where: {id: userId},
            });

            if (!user) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Utente non registrato.",
                });
            }

            const sessions = await ctx.db.session.findMany({
                where: {userId: userId},
            });

            return sessions;
        }),
    revokeSession: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ctx, input}) => {
            const userId = ctx.session.user.id;

            const session = await ctx.db.session.findUnique({
                where: { id: input.id }
            });

            if (!session || session.userId !== userId) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Sessione non trovata o non autorizzata.",
                });
            }

            await ctx.db.session.delete({ where: { id: input.id } });

            return { success: true };
        }),
});

