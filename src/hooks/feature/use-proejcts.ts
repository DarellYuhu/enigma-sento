import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export const useProjects = () => {
  const { workgroupId } = useParams();
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["projects", workgroupId],
    queryFn: async () => {
      console.log("workgorupId", workgroupId);
      const { data } = await SentoClient.get<GetProjectsResponse>(
        `/workgroups/${workgroupId}/projects`,
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      return data;
    },
  });
};

export type GetProjectsResponse = {
  message: string;
  data: {
    name: string;
    workgroupId: string;
    status: boolean;
    id: string;
    workgroupUserId: number;
  }[];
};
