import { AddMusicsForm } from "./add-musics-form";
import { CollectionList } from "./collection-list";
import { MusicList } from "./music-list";

export const MusicPanel = () => {
  return (
    <div className="space-y-4">
      <CollectionList type="MUSIC" />
      <AddMusicsForm />
      <MusicList />
    </div>
  );
};
