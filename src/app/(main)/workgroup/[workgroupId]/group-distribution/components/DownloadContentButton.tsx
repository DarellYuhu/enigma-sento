import { Button } from "@/components/ui/button";
import { useDownloadContent } from "@/hooks/feature/workgroup/use-download-content";
import { Download, LoaderCircle } from "lucide-react";

export const DownloadContentButton = ({
  groupDistributionId,
  projectIds,
}: {
  groupDistributionId: string;
  projectIds: string[];
}) => {
  const { mutate, isPending } = useDownloadContent();

  return (
    <Button
      size={"sm"}
      onClick={() => mutate({ groupDistributionId, projectIds })}
      disabled={projectIds.length === 0 || isPending}
    >
      {isPending && (
        <LoaderCircle
          className="-ms-1 me-2 animate-spin"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
      Download Content
      <Download className="size-4" />
    </Button>
  );
};
