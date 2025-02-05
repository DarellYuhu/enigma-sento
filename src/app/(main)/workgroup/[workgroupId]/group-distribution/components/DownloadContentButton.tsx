import { Button } from "@/components/ui/button";
import { useDownloadContent } from "@/hooks/feature/use-download-content";
import { Download } from "lucide-react";

export const DownloadContentButton = ({
  groupDistributionId,
  projectIds,
}: {
  groupDistributionId: string;
  projectIds: string[];
}) => {
  const { mutate } = useDownloadContent();

  return (
    <div className="col-span-full">
      <Button
        size={"sm"}
        onClick={() => mutate({ groupDistributionId, projectIds })}
        disabled={projectIds.length === 0}
      >
        Download Content
        <Download className="size-4" />
      </Button>
    </div>
  );
};
