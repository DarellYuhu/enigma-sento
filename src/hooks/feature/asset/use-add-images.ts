import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const useAddImages = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const randomNumber = Math.floor(Math.random() * 1000);
      const uploadPayload = await Promise.all(
        payload.files.map(async (file, idx) => {
          const path = `all/images/${randomNumber}/${file.name}`;
          const presignUrl = await SentoClient.get(
            `/storage/upload?path=${path}`
          );
          await fetch(presignUrl.data.data, { method: "PUT", body: file });
          return {
            path,
            name: file.name,
            ...payload.data[idx],
          };
        })
      );
      const { data } = await SentoClient.post("/assets/images", {
        data: uploadPayload,
      });
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["collections", "images", search ?? ""],
      });
      toast.success("Images added!");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};

type Payload = {
  files: File[];
  data: {
    description: string;
    tags: string[];
    people: string[];
    location?: {
      name: string;
      geoJson: {
        coordinates: number[];
      };
    };
  }[];
};
