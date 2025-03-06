import { CollectionList } from "./collection-list";
import { RepurposeAddVideosForm } from "./repurpose-add-videos-form";
import { RepurposeVideoList } from "./repurpose-video-list";

export const RepurposeVideosPanel = () => {
  return (
    <div className="space-y-4">
      <CollectionList type="REP-VIDEO" />
      <RepurposeAddVideosForm />
      <RepurposeVideoList />
    </div>
  );
};
