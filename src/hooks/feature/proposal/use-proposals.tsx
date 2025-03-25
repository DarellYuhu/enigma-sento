import { SentoClient } from "@/lib/sento-client";
import { StatusEnum } from "@/types/enums";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useProposals = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      const { data } = await SentoClient.get<Data>("/proposals", {
        headers: { Authorization: `Bearer ${session?.user?.token}` },
      });
      return data;
    },
  });
};

type Data = {
  message: string;
  data: Proposal[];
};

type Author = {
  displayName: string;
  id: string;
};

export type Proposal = {
  id: string;
  title: string;
  status: StatusEnum;
  authorId: string;
  approverId: string;
  projectId: string | null;
  submissionId: number;
  createdAt: string;
  updatedAt: string;
  approvedAt: string;
  Author: Author;
  Approver: Author | null;
};
