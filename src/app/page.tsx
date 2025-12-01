"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { useTRPC } from "@/trpc/client";

const Page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorflows.queryOptions());

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.getWorflows.queryOptions());
      },
    }),
  );

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected server component
      <div>{JSON.stringify(data, null, 2)}</div>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        create workflow
      </Button>
    </div>
  );
};

export default Page;
