import { SentoClient } from "@/lib/sento-client";
import { StatusEnum } from "@/types/enums";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export const useProposal = () => {
  const params = useParams();
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["proposals", params.id],
    queryFn: async () => {
      const { data } = await SentoClient.get<Data>(`/proposals/${params.id}`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` },
      });
      return data;
    },
  });
};

type Data = {
  message: string;
  data: {
    id: string;
    title: string;
    status: StatusEnum;
    Feedback: {
      message: string;
      uri?: string;
      User: { id: string; displayName: string };
      createdAt: string;
    }[];
    Submission: { id: string; uri: string; createdAt: string }[];
    Author: {
      id: string;
      displayName: string;
    };
  };
};
