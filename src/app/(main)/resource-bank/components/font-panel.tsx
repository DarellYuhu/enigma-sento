import { AddFontsForm } from "./add-fonts-form";
import { FontList } from "./font-list";

export const FontPanel = () => {
  return (
    <div className="space-y-4">
      <AddFontsForm />
      <FontList />
    </div>
  );
};
