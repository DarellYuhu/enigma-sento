import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGroupDistributions = () => {
  const searchParams = useSearchParams();
  const workgroupId = searchParams.get("workgroupId");

  return useQuery({
    queryKey: ["workgroup", workgroupId, "group-distribution"],
    queryFn: async () => {
      const { data } = await SentoClient.get<GetGroupDistributionsResponse>(
        `/workgroups/${workgroupId}/group-distributions`
      );
      return data;
    },
  });
};

export type GroupDistribution = {
  code: string;
  amontOfTroops: number;
  workgroupId: string;
};

export type GetGroupDistributionsResponse = {
  message: string;
  data: GroupDistribution[];
};
