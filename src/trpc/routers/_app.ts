import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getWorflows: protectedProcedure.query(({ ctx }) => {
    console.log({ userId: ctx.auth.user.id });
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "mirazhs@proton.me",
      },
    });
    return prisma.workflow.create({
      data: {
        name: "test-workflow",
      },
    });
  }),
});

export type AppRouter = typeof appRouter;
