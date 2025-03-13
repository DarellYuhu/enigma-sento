import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export const useTaskDistribution = () => {
  const searchParams = useSearchParams();
  const workgroupId = searchParams.get("workgroupId");
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["workgroup", workgroupId, "task-distribution"],
    queryFn: async () => {
      const { data } = await SentoClient.get<GetWorkgroupUserTasksResponse>(
        `/workgroups/${workgroupId}/user-tasks`,
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
      return data;
    },
  });
};

type Distribution = {
  code: string;
  amontOfTroops: number;
};

export type WorkgroupUserTasks = {
  workgroupUserId: number;
  displayName: string;
  distributions: Distribution[];
};

type GetWorkgroupUserTasksResponse = {
  message: string;
  data: Record<
    string,
    {
      id: number;
      createdAt: Date;
      workgroupId: string;
      users: WorkgroupUserTasks[];
    }
  >;
};
