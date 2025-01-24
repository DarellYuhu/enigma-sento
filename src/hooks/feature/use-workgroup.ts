import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export const useWorkgroup = () => {
  const { data: session } = useSession();
  const params = useParams();

  return useQuery({
    queryKey: ["workgroup", params.workgroupId],
    queryFn: async () => {
      const { data } = await SentoClient.get(
        `/workgroups/${params.workgroupId}`,
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
      return data;
    },
  });
};
