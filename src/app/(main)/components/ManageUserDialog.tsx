import { EnigmaTooltip } from "@/components/enigma/tooltip";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { WorkgroupUserDatatable } from "./WorkgroupUserDatatable";
import { AddUserForm } from "./AddUserForm";

export const ManageUserDialog = ({ id }: { id: string }) => {
  return (
    <Dialog
      onOpenChange={() => {
        const url = new URL(window.location.href);
        url.searchParams.set("workgroupId", id);
        window.history.pushState({}, "", url.toString());
      }}
    >
      <EnigmaTooltip content="Manage User">
        <DialogTrigger
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <Users />
        </DialogTrigger>
      </EnigmaTooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage workgroup users</DialogTitle>
        </DialogHeader>
        <AddUserForm />
        <WorkgroupUserDatatable />
      </DialogContent>
    </Dialog>
  );
};
