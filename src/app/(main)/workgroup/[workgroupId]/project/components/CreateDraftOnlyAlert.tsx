import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { useCreateStory } from "@/hooks/feature/use-create-story";

export const CreateDraftOnlyAlert = ({ projectId }: { projectId: string }) => {
  const { mutate } = useCreateStory();

  const handleSubmit = () => {
    mutate({ type: "USER_GENERATE", projectId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants()}>
        Create Draft Only
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create draft only story?</AlertDialogTitle>
          <AlertDialogDescription>
            If you already have the asset that you want to submit, press this
            button bellow to create empty story.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
