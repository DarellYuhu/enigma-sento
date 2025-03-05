import { RepurposeAddVideosForm } from "./repurpose-add-videos-form";
import { RepurposeVideoList } from "./repurpose-video-list";

export const RepurposeVideosPanel = () => {
  return (
    <div className="space-y-4">
      <RepurposeAddVideosForm />
      <RepurposeVideoList />
    </div>
  );
};
