"use client";

import { Badge } from "@/components/ui/badge";
import { useColors } from "@/hooks/feature/use-colors";

export const ColorList = () => {
  const { data } = useColors();

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {data?.data.map((item) => (
        <div
          key={item._id}
          className="space-x-2 border-2 p-2 rounded-md flex shadow-md"
        >
          <Badge className="size-6" style={{ color: item.primary }} />
          <Badge className="size-6" style={{ color: item.secondary }} />
        </div>
      ))}
    </div>
  );
};
