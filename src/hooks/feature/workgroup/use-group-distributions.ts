import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";

export const useGroupDistributions = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const workgroupId = searchParams.get("workgroupId");
  const { data: session } = useSession();

  return useQuery({
    queryKey: [
      "workgroup",
      params.workgroupId ?? workgroupId,
      "group-distribution",
    ],
    queryFn: async () => {
      const id = params.workgroupId ?? workgroupId;
      const { data } = await SentoClient.get<GetGroupDistributionsResponse>(
        `/workgroups/${id}/group-distributions`,
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      return data;
    },
  });
};

export type GroupDistribution = {
  id: string;
  code: string;
  amontOfTroops: number;
  workgroupId: string;
  projects: Projects[];
};

export type GetGroupDistributionsResponse = {
  message: string;
  data: GroupDistribution[];
};

export type Projects = {
  id: string;
  name: string;
  status: boolean;
  workgroupId: string;
  workgroupUserId: number;
};
