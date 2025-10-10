import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateStoryForm } from "./CreateStoryForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateDraftOnlyAlert } from "./CreateDraftOnlyAlert";

export const CreateStoryDialog = ({ projectId }: { projectId: string }) => {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants()}>Create Story</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Create new story?</DialogTitle>
          <DialogDescription>
            Please fill all the fields below to create a new story
          </DialogDescription>
        </DialogHeader>
        <CreateDraftOnlyAlert projectId={projectId} />
        {/* <p className="flex items-center text-center text-xs font-semibold text-muted-foreground justify-center"> */}
        {/*   - Or fill this form - */}
        {/* </p> */}
        {/* <ScrollArea className="h-[420px]"> */}
        {/*   <CreateStoryForm projectId={projectId} /> */}
        {/* </ScrollArea> */}
      </DialogContent>
    </Dialog>
  );
};
