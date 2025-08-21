import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useLayouts = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  console.log(search);
  return useQuery({
    queryKey: ["layouts", { search }],
    async queryFn() {
      const { data } = await SentoClient.get<Layout[]>("layouts", {
        params: { search },
      });
      return data;
    },
  });
};
