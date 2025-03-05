"use client";

import { useRepurposeVideos } from "@/hooks/feature/use-repurpose-videos";

export const RepurposeVideoList = () => {
  const { data } = useRepurposeVideos();

  return (
    <div className="grid grid-cols-4 gap-3">
      {data?.data.map((item) => (
        <video
          src={item.url}
          width={1080}
          height={1080}
          key={item._id}
          className="size-40 shadow-md rounded-md object-cover"
          controls
        >
          <source src={item.url} type="video/mp4" />
        </video>
      ))}
    </div>
  );
};
