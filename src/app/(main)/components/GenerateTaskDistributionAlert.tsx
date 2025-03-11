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
import { useGenerateTask } from "@/hooks/feature/use-generate-task";
import { useState } from "react";

export const GenerateTaskDistributionAlert = () => {
  const { mutate, isPending } = useGenerateTask();
  const [open, setOpen] = useState(false);

  const handleGenerate = () =>
    mutate(undefined, {
      onSuccess() {
        setOpen(false);
      },
    });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={`${buttonVariants()} w-fit`}>
        Generate Task Distribution
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ready to generate task distribution?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will generate a task distribution for each user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleGenerate}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
