import { Datatable } from "@/components/datatable";
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
import { Button } from "@/components/ui/button";
import { useDeleteWorkgroupUser } from "@/hooks/feature/use-delete-workgroup-user";
import {
  useWorkgroupUser,
  WorkgroupUser,
} from "@/hooks/feature/use-workgroup-user";
import { ColumnDef } from "@tanstack/react-table";
import { CircleAlert, Trash2 } from "lucide-react";
import { useState } from "react";

export const WorkgroupUserDatatable = () => {
  const { data } = useWorkgroupUser();

  return (
    <div>
      <Datatable columns={columns} data={data?.data || []} />
    </div>
  );
};

const DeleteUserAlert = ({ row }: { row: WorkgroupUser }) => {
  const [open, setOpen] = useState(false);
  const { mutate } = useDeleteWorkgroupUser();

  const handleDelete = () => {
    mutate(row.userId, {
      onSuccess() {
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size={"icon"} className="hover:text-red-500">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>{`Are you sure you want to remove ${(
              <strong>{row.displayName}</strong>
            )} from workgroup? All data related to this user in this workgroup will be deleted.`}</AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const columns: ColumnDef<WorkgroupUser>[] = [
  {
    accessorKey: "displayName",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: "Actions",
    cell({ row }) {
      return <DeleteUserAlert row={row.original} />;
    },
  },
];
