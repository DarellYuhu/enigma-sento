import { CollectionList } from "./collection-list";
import { RepurposeAddBannersForm } from "./repurpose-add-banners-form";
import { RepurposeBannerList } from "./repurpose-banner-list";

export const RepurposeBannersPanel = () => {
  return (
    <div className="space-y-4">
      <CollectionList type="REP-BANNER" />
      <RepurposeAddBannersForm />
      <RepurposeBannerList />
    </div>
  );
};
