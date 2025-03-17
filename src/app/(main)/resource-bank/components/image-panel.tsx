import AddImageForm from "./add-image-form";
import { CollectionList } from "./collection-list";
import ImageList from "./image-list";
import { Search } from "./search";

export const ImagePanel = () => {
  return (
    <div className="space-y-4">
      <CollectionList type="IMAGE" />
      <AddImageForm />
      <Search />
      <ImageList />
    </div>
  );
};
