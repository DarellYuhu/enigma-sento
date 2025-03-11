import { AddFontsForm } from "./add-fonts-form";
import { CollectionList } from "./collection-list";
import { FontList } from "./font-list";

export const FontPanel = () => {
  return (
    <div className="space-y-4">
      <CollectionList type="FONT" />
      <AddFontsForm />
      <FontList />
    </div>
  );
};
