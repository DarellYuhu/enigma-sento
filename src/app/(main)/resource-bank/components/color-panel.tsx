import { AddColorsForm } from "./add-colors-form";
import { ColorList } from "./color-list";
import { CollectionList } from "./collection-list";
import { AddToCollection } from "@/components/enigma/add-to-collection";
import { useState } from "react";

export const ColorPanel = () => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <CollectionList type="COLOR" />
      <div className="flex flex-row justify-between">
        <AddColorsForm />
        <AddToCollection selected={selected} type="COLOR" />
      </div>
      <ColorList onColorSelect={setSelected} />
    </div>
  );
};
