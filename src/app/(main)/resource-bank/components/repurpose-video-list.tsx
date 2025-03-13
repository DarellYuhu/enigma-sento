"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRepurposeVideos } from "@/hooks/feature/asset/use-repurpose-videos";
import { useEffect, useState } from "react";

export const RepurposeVideoList = ({
  onVideSelect,
  toggleSelectArea = false,
}: {
  onVideSelect?: (values: string[]) => void;
  toggleSelectArea?: boolean;
}) => {
  const [values, setValues] = useState<string[]>([]);
  const { data } = useRepurposeVideos();

  useEffect(() => {
    if (onVideSelect) onVideSelect(values);
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
        <div
          key={item._id}
          className="space-y-2 justify-items-center flex-col p-2 border rounded-md"
        >
          {toggleSelectArea && (
            <ToggleGroupItem
              value={item._id}
              className="data-[state=on]:bg-sky-200"
            >
              Click to select
            </ToggleGroupItem>
          )}
          <video
            src={item.url}
            width={1080}
            height={1080}
            className="size-40 shadow-md rounded-md object-cover"
            controls
          >
            <source src={item.url} type="video/mp4" />
          </video>
        </div>
      ))}
    </ToggleGroup>
  );
};
