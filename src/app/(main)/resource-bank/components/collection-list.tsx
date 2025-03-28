import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCollections } from "@/hooks/feature/asset/use-collections";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CollectionList = ({ type }: { type: CollectionType }) => {
  const [value, setValue] = useState("");
  const { data } = useCollections({ type });
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    if (value === "") {
      searchParams.delete("collectionId");
    } else {
      searchParams.set("collectionId", value);
    }
    router.push(`?${searchParams.toString()}`);
    // @ts-ignore
  }, [value]);

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      className="flex flex-row flex-wrap"
      value={value}
      onValueChange={setValue}
    >
      {data?.data.map((item) => (
        <ToggleGroupItem value={item._id} key={item._id}>
          {item.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
