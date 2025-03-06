import { CollectionList } from "./collection-list";
import { RepurposeAddImagesForm } from "./repurpose-add-images-form";
import { RepurposeImageList } from "./repurpose-image-list";

export const RepurposeImagesPanel = () => {
  return (
    <div className="space-y-4">
      <CollectionList type="REP-IMAGE" />
      <RepurposeAddImagesForm />
      <RepurposeImageList />
    </div>
  );
};
