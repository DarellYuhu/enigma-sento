import { EnigmaTooltip } from "@/components/enigma/tooltip";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClipboardList } from "lucide-react";
import { GenerateTaskDistributionAlert } from "./GenerateTaskDistributionAlert";
import { TaskDistributionDatatable } from "./TaskDistributionDatatable";
import Link from "next/link";

export const ManageTaskDialog = ({ id }: { id: string }) => {
  return (
    <Dialog
      onOpenChange={() => {
        const url = new URL(window.location.href);
        url.searchParams.set("workgroupId", id);
        window.history.pushState({}, "", url.toString());
      }}
    >
      <EnigmaTooltip content="Manage Task">
        <DialogTrigger
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ClipboardList />
        </DialogTrigger>
      </EnigmaTooltip>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Manage Group Distribution Task</DialogTitle>
          <DialogDescription>
            You can manage the distribution of tasks to each user on the
            workgroup here
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-between">
          <GenerateTaskDistributionAlert />
          <Link
            href={`/workgroup/${id}/group-distribution`}
            className={buttonVariants({ variant: "outline" })}
          >
            View All
          </Link>
        </div>
        <TaskDistributionDatatable />
      </DialogContent>
    </Dialog>
  );
};
