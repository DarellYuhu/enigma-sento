"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCollections } from "@/hooks/feature/use-collections";
import { useState } from "react";

export const CollectionList = ({ type }: { type: CollectionType }) => {
  const [value, setValue] = useState("left");
  const { data } = useCollections({ type });
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={(value) => {
        if (value) setValue(value);
      }}
      className="flex flex-row flex-wrap"
    >
      {data?.data.map((item) => (
        <ToggleGroupItem value={item._id} key={item._id}>
          {item.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
