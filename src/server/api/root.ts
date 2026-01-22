import {ExampleRouter} from "./routers/example";
import {createCallerFactory, createTRPCRouter} from "@/server/api/trpc";
import {profileRouter} from "@/server/api/routers/profile";
import {groupsRouter} from "@/server/api/routers/groups";


export const appRouter = createTRPCRouter({
    example: ExampleRouter,
    profile: profileRouter,
    groups: groupsRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);