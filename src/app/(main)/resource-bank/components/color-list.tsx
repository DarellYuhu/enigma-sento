"use client";

import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useColors } from "@/hooks/feature/asset/use-colors";
import { useEffect, useState } from "react";

export const ColorList = ({
  onColorSelect,
}: {
  onColorSelect?: (values: string[]) => void;
}) => {
  const [value, setValue] = useState<string[]>([]);
  const { data } = useColors();

  useEffect(() => {
    if (onColorSelect) onColorSelect(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <ToggleGroup
      className="flex flex-row flex-wrap gap-2 place-self-start"
      type="multiple"
      variant="outline"
      value={value}
      onValueChange={(value) => {
        if (value) setValue(value);
      }}
    >
      {data?.data.map((item) => (
        <ToggleGroupItem
          value={item._id}
          key={item._id}
          className="space-x-2 border-2 p-2 rounded-md flex shadow-md data-[state=on]:bg-sky-200"
          size={"lg"}
        >
          <Badge className="size-6" style={{ backgroundColor: item.primary }} />
          <Badge
            className="size-6"
            style={{ backgroundColor: item.secondary }}
          />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
