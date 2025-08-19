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
import { Input } from "@/components/ui/input";
import { useCreateStory } from "@/hooks/feature/project/use-create-story";
import { useState } from "react";
import { toast } from "sonner";

export const CreateDraftOnlyAlert = ({ projectId }: { projectId: string }) => {
  const { mutate } = useCreateStory();
  const [section, setSection] = useState(1);

  const handleSubmit = () => {
    if (section < 1) return toast.error("Sectiom must be >= 1");
    mutate({ type: "USER_GENERATE", projectId, section });
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
        <Input value={section} onChange={(e) => setSection(+e.target.value)} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
