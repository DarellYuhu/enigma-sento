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
        `/projects?workgroupId=${workgroupId}`,
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
    allocationType: "GENERIC" | "SPECIFIC";
    captions: string[] | null;
    hashtags: string | null;
    Story: Story[];
  }[];
};

export type StoryData = {
  _id: string;
  texts: string[];
  images: { path: string; name: string; url: string; _id: string }[];
  textColor: string;
  textBgColor: string;
  textStroke: string;
  textPosition: "random" | "middle" | "bottom";
};

export type Story = {
  _id: string;
  section: number;
  contentPerStory: number | null;
  type: "USER_GENERATE" | "SYSTEM_GENERATE";
  projectId: string;
  data: StoryData[];
  captions: string[];
  hashtags: null | string[];
  generatorStatus: "NOT_GENERATE" | "RUNNING" | "FINISHED" | "ERROR";
};
