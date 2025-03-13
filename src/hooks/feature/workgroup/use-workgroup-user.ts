import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export const useWorkgroupUser = () => {
  const searchParams = useSearchParams();
  const workgroupId = searchParams.get("workgroupId");
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["workgroup", workgroupId, "user"],
    queryFn: async () => {
      const { data } = await SentoClient.get<GetWorkgroupUsersResponse>(
        `/workgroups/${workgroupId}/users`,
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      return data;
    },
  });
};

export type WorkgroupUser = {
  workgroupId: number;
  userId: string;
  username: string;
  displayName: string;
  role: string;
};

export type GetWorkgroupUsersResponse = {
  message: string;
  data: WorkgroupUser[];
};
