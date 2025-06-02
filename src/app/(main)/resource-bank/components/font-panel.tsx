import { AddFontsForm } from "./add-fonts-form";
import { CollectionList } from "./collection-list";
import { FontList } from "./font-list";
import { useState } from "react";
import { AddToCollection } from "@/components/enigma/add-to-collection";

export const FontPanel = () => {
  const [selected, setSelected] = useState<FontAsset[]>([]);

  return (
    <div className="space-y-4">
      <CollectionList type="FONT" />
      <div className="flex flex-row justify-between">
        <AddFontsForm />
        <AddToCollection selected={selected.map((select) => select._id)} />
      </div>
      <FontList onRowSelect={setSelected} />
    </div>
  );
};
