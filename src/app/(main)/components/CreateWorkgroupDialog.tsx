import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateWorkgroupForm } from "./CreateWorkgroupForm";

export const CreateWorkgroupDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className={`${buttonVariants()} self-end`}>
        Create Workgroup
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new workgroup</DialogTitle>
          <DialogDescription>
            Fill this form bellow to create a new workgroup
          </DialogDescription>
        </DialogHeader>
        <CreateWorkgroupForm />
      </DialogContent>
    </Dialog>
  );
};
