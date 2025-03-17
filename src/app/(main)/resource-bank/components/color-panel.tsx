import { AddColorsForm } from "./add-colors-form";
import { ColorList } from "./color-list";
import { CollectionList } from "./collection-list";

export const ColorPanel = () => {
  return (
    <div className="space-y-4">
      <CollectionList type="COLOR" />
      <AddColorsForm />
      <ColorList />
    </div>
  );
};
