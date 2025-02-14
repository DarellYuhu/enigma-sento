import { AddColorsForm } from "./add-colors-form";
import { ColorList } from "./color-list";

export const ColorPanel = () => {
  return (
    <div className="space-y-4">
      <AddColorsForm />
      <ColorList />
    </div>
  );
};
