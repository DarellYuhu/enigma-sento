import { Button } from "@/components/ui/button";
import { useGenerateContent } from "@/hooks/feature/use-generate-content";

export const GenerateContentButton = ({ storyId }: { storyId: string }) => {
  const { mutate, isPending } = useGenerateContent();

  return (
    <Button disabled={isPending} onClick={() => mutate(storyId)}>
      Generate
    </Button>
  );
};
