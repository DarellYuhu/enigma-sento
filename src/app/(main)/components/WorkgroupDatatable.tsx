"use client";

import { Datatable } from "@/components/datatable";
import { useWorkgroups, Workgroup } from "@/hooks/feature/use-workgroups";
import { ColumnDef } from "@tanstack/react-table";
import { ManageUserDialog } from "./ManageUserDialog";
import { ManageGroupDistributionDialog } from "./ManageGroupDistributionDialog";
import { ManageTaskDialog } from "./ManageTaskDialog";
import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

export const WorkgroupDatatable = () => {
  const { data: session } = useSession();

  const { data } = useWorkgroups();
  return (
    <div>
      {data && (
        <Datatable columns={columns(session?.user?.role)} data={data.data} />
      )}
    </div>
  );
};

const columns: (role?: string) => ColumnDef<Workgroup["data"][0]>[] = (
  role
) => {
  const menu: ColumnDef<Workgroup["data"][0]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell({ row }) {
        return (
          <Link
            href={`/workgroup/${row.original.id}/project`}
            className={badgeVariants({ variant: "outline" })}
          >
            {row.original.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "projectStoryPerUser",
      header: "Project Story Per User",
    },
  ];
  switch (role) {
    case "MANAGER":
    case "DISTRIBUTOR":
      menu.push(
        {
          accessorKey: "session",
          header: "Session",
        },
        {
          id: "actions",
          header: "Actions",
          cell(props) {
            return (
              <div className="space-x-2">
                <ManageUserDialog id={props.row.original.id} />
                <ManageGroupDistributionDialog id={props.row.original.id} />
                <ManageTaskDialog id={props.row.original.id} />
              </div>
            );
          },
        }
      );
      break;

    default:
      break;
  }

  return menu;
};
