import { SentoClient } from "@/lib/sento-client";

export const getUploadUrl = (path: string) => {
  return SentoClient.get<{ data: string }>("/storage/upload", {
    params: { path },
  });
};
