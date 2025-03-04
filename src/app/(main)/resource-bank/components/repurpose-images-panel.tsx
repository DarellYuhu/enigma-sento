import { RepurposeAddImagesForm } from "./repurpose-add-images-form";
import { RepurposeImageList } from "./repurpose-image-list";

export const RepurposeImagesPanel = () => {
  return (
    <div className="space-y-4">
      <RepurposeAddImagesForm />
      <RepurposeImageList />
    </div>
  );
};
