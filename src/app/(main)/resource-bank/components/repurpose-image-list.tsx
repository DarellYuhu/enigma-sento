import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRepurposeImages } from "@/hooks/feature/asset/use-repurpose-images";
import Image from "next/image";
import { useEffect, useState } from "react";

export const RepurposeImageList = ({
  onImageSelect,
}: {
  onImageSelect?: (values: string[]) => void;
}) => {
  const [values, setValues] = useState<string[]>([]);
  const { data } = useRepurposeImages();

  useEffect(() => {
    if (onImageSelect) onImageSelect(values);
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
          <Image src={item.url} alt={item.name} width={1080} height={1080} />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
