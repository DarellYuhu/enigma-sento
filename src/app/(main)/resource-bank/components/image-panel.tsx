import { ScrollArea } from "@/components/ui/scroll-area";
import AddImageForm from "./add-image-form";
import { CollectionList } from "./collection-list";
import ImageList from "./image-list";
import { Search } from "./search";

export const ImagePanel = () => {
  return (
    <div className="space-y-4">
      <ScrollArea className="max-h-[300px]">
        <CollectionList type="IMAGE" />
      </ScrollArea>
      <AddImageForm />
      <Search />
      <ImageList />
    </div>
  );
};
