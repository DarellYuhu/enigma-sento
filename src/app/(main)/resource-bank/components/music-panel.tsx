import { AddMusicsForm } from "./add-musics-form";
import { MusicList } from "./music-list";

export const MusicPanel = () => {
  return (
    <div className="space-y-4">
      <AddMusicsForm />
      <MusicList />
    </div>
  );
};
