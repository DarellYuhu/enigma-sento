import { EnigmaTooltip } from "@/components/enigma/tooltip";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderKanban } from "lucide-react";
import { AddGroupDistributionForm } from "./AddGroupDistributionForm";
import { GroupDistributionDatatable } from "./GroupDistributionDatatable";

export const ManageGroupDistributionDialog = ({ id }: { id: string }) => {
  return (
    <Dialog
      onOpenChange={() => {
        const url = new URL(window.location.href);
        url.searchParams.set("workgroupId", id);
        window.history.pushState({}, "", url.toString());
      }}
    >
      <EnigmaTooltip content="Manage Group Distribution">
        <DialogTrigger
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <FolderKanban />
        </DialogTrigger>
      </EnigmaTooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Group Distribution</DialogTitle>
        </DialogHeader>
        <AddGroupDistributionForm />
        <GroupDistributionDatatable />
      </DialogContent>
    </Dialog>
  );
};
