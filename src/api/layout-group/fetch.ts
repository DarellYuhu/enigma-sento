import { SentoClient } from "@/lib/sento-client";

export const getLayoutGroups = () => {
  return SentoClient.get<LayoutGroup[]>("/layout-groups");
};
