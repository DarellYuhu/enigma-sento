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
import { useGenerateContentDist } from "@/hooks/feature/use-generate-content-dist";
import { useRef } from "react";

export const GenerateContentDistributionAlert = ({
  projectId,
}: {
  projectId: string;
}) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { mutate } = useGenerateContentDist();

  const handleGenerate = () => {
    mutate(projectId, {
      onSuccess() {
        closeBtnRef.current?.click();
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants()}>
        Allocate Contents
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generate content distribution</AlertDialogTitle>
          <AlertDialogDescription>
            Click the button bellow to generate content distribution in this
            project
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleGenerate}>
            Continue
          </AlertDialogAction>
          <AlertDialogCancel ref={closeBtnRef}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
