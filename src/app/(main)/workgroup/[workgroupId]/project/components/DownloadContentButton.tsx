import { Button } from "@/components/ui/button";
import { useDownloadContent } from "@/hooks/feature/use-download-content";
import { Download } from "lucide-react";

export const DownloadContentButton = ({ storyId }: { storyId: string }) => {
  const { mutate } = useDownloadContent();

  return (
    <div className="col-span-full">
      <Button size={"sm"} onClick={() => mutate(storyId)}>
        Download Content
        <Download className="size-4" />
      </Button>
    </div>
  );
};
