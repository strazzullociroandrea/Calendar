import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {CreateGroupSchema} from '@/lib/schemas/group';
import {TRPCError} from "@trpc/server";


export const groupsRouter = createTRPCRouter({
    getGroups: protectedProcedure.query(async ({ctx}) => {
        const userId = ctx.session.user.id;

        const groups = await ctx.db.group.findMany({
            where: {
                ownerId: userId,
            },
            select: {
                id: true,
                name: true,
                invitation: true,
                description: true,
                ownerId: true,
                _count: {
                    select: {members: true},
                },
            },
        });

        return groups.map(({...group}) => ({
            ...group,
            invitation: group.ownerId === userId ? group.invitation : null,
        }));

    }),
    createGroup: protectedProcedure
        .input(CreateGroupSchema)
        .mutation(async ({ctx, input}) => {
            const userId = ctx.session.user.id;
            let attempts = 0;
            const maxAttempts = 5;

            let group = null;
            while (attempts < maxAttempts) {
                try {
                    const invitationCode = crypto.randomUUID().slice(0, 6).toUpperCase();

                    group = await ctx.db.group.create({
                        data: {
                            name: input.name,
                            description: input.description,
                            invitation: invitationCode,
                            owner: {
                                connect: {id: userId},
                            },
                        },
                    });

                    break;

                } catch (e) {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        throw new TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "Non è stato possibile creare il gruppo dopo diversi tentativi.",
                        });
                    }
                }
            }

            if (group)
                return group;

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Non è stato possibile creare il gruppo. Riprova più tardi.",
            });
        })
});