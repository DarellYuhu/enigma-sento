import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

export const useGroupDistributions = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const workgroupId = searchParams.get("workgroupId");

  return useQuery({
    queryKey: [
      "workgroup",
      params.workgroupId ?? workgroupId,
      "group-distribution",
    ],
    queryFn: async () => {
      const id = params.workgroupId ?? workgroupId;
      const { data } = await SentoClient.get<GetGroupDistributionsResponse>(
        `/workgroups/${id}/group-distributions`
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
