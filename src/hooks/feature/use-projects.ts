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
    Story: Story[];
  }[];
};

export type StoryData = {
  texts: string[];
  images: string[];
  textColor: string;
  textPosition:
    | "top-left"
    | "top-center"
    | "top-right"
    | "middle-left"
    | "middle-center"
    | "middle-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
};

export type Story = {
  id: string;
  section: number;
  contentPerStory: number | null;
  type: "USER_GENERATE" | "SYSTEM_GENERATE";
  projectId: string;
  data: StoryData[] | null;
  captions: string[];
  hashtags: null | string[];
  generatorStatus: "NOT_GENERATE" | "RUNNING" | "FINISHED" | "ERROR";
};
