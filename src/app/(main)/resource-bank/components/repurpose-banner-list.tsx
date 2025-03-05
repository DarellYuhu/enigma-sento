"use client";

import { useRepurposeBanners } from "@/hooks/feature/use-repurpose-banners";
import Image from "next/image";

export const RepurposeBannerList = () => {
  const { data } = useRepurposeBanners();

  return (
    <div className="grid grid-cols-4 gap-3">
      {data?.data.map((item) => (
        <Image
          src={item.url}
          alt={item.name}
          width={1080}
          height={1080}
          key={item._id}
          className="size-40 shadow-md rounded-md object-cover"
        />
      ))}
    </div>
  );
};
