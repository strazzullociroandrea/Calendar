import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc";
import {CreateGroupSchema, deleteGroupSchema, joinGroupSchema} from '@/lib/schemas/group';
import {TRPCError} from "@trpc/server";


export const groupsRouter = createTRPCRouter({
    getGroups: protectedProcedure.query(async ({ctx}) => {

        try {
            const userId = ctx.session.user.id;

            const groups = await ctx.db.group.findMany({
                where: {
                    OR: [
                        {ownerId: userId},
                        {
                            members: {
                                some: {
                                    userId: userId
                                },
                            },
                        },
                    ],
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

            return groups.map((group) => ({
                ...group,
                invitation: group.ownerId === userId ? group.invitation : null,
                isOwner: group.ownerId === userId,
            }));
        } catch (e) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Non è stato possibile recuperare i gruppi. Riprova più tardi.",
            });
        }
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
                            message: "Non è stato possibile creare il gruppo. Riprova più tardi",
                        });
                    }
                }
            }

            return group;

        }),
    deleteGroup: protectedProcedure
        .input(deleteGroupSchema)
        .mutation(async ({ctx, input}) => {
            const userId = ctx.session.user.id;
            const groupId = input.id;

            try {
                const group = await ctx.db.group.findUnique({
                    where: {id: groupId},
                });

                if (!group || group.ownerId !== userId) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Non hai i permessi per eliminare questo gruppo.",
                    });
                }


                await ctx.db.group.delete({
                    where: {id: groupId},
                });

                return {success: true};

            } catch (e) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Non è stato possibile eliminare il gruppo. Riprova più tardi.",
                });
            }


        }),
    joinGroup: protectedProcedure
        .input(joinGroupSchema)
        .mutation(async ({ctx, input}) => {
            const userId = ctx.session.user.id;

            const group = await ctx.db.group.findUnique({
                where: {invitation: input.invitation},
            });

            if (!group) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Codice di invito non valido.",
                });
            }

            const isMember = await ctx.db.userGroup.findFirst({
                where: {
                    groupId: group.id,
                    userId: userId,
                },
            });

            if (isMember) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Sei già membro di questo gruppo.",
                });
            }

            await ctx.db.userGroup.create({
                data: {
                    groupId: group.id,
                    userId: userId,
                },
            });

            return {success: true};
        }),
    quitGroup: protectedProcedure
        .input(deleteGroupSchema)
        .mutation(async ({ctx, input}) => {
            try {
                const userId = ctx.session.user.id;
                const groupId = input.id;

                await ctx.db.userGroup.delete({
                    where: {
                        userId_groupId: {
                            groupId: groupId,
                            userId: userId,
                        },
                    },
                });

                return {success: true};
            } catch (e) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Non è stato possibile abbandonare il gruppo. Riprova più tardi.",
                });
            }

        })
});