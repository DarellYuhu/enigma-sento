import { SentoClient } from "@/lib/sento-client";

export const getLayouts = () => {
  return SentoClient.get<Layout[]>("/layouts");
};

export const getLayoutById = (id: string) => {
  return SentoClient.get<Layout | null>(`/layouts/${id}`);
};
