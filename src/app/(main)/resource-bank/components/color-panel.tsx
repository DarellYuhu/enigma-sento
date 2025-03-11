import { AddColorsForm } from "./add-colors-form";
import { CollectionList } from "./collection-list";
import { ColorList } from "./color-list";

export const ColorPanel = () => {
  return (
    <div className="space-y-4">
      <CollectionList type="COLOR" />
      <AddColorsForm />
      <ColorList />
    </div>
  );
};
