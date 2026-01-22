import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const ExampleRouter = createTRPCRouter({
    hello: publicProcedure.query(async () => {
         return "Hello world";
    }),
});