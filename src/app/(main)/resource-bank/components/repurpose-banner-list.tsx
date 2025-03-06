"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRepurposeBanners } from "@/hooks/feature/use-repurpose-banners";
import Image from "next/image";
import { useEffect, useState } from "react";

export const RepurposeBannerList = ({
  onBannerSelect,
}: {
  onBannerSelect?: (values: string[]) => void;
}) => {
  const [values, setValues] = useState<string[]>([]);
  const { data } = useRepurposeBanners();

  useEffect(() => {
    if (onBannerSelect) onBannerSelect(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <ToggleGroup
      className="flex flex-row flex-wrap gap-2 place-self-start"
      type="multiple"
      variant="outline"
      value={values}
      onValueChange={(values) => {
        if (values) setValues(values);
      }}
    >
      {data?.data.map((item) => (
        <ToggleGroupItem
          value={item._id}
          key={item._id}
          className="space-x-2 border-2 p-2 rounded-md flex shadow-md data-[state=on]:bg-sky-200 size-40 object-cover"
          size={"lg"}
          asChild
        >
          <Image
            src={item.url}
            alt={item.name}
            width={1080}
            height={1080}
            className="size-40 shadow-md rounded-md object-cover"
          />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
