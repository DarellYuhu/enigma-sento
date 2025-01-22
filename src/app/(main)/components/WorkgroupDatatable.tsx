"use client";

import { Datatable } from "@/components/datatable";
import { useWorkgroup, Workgroup } from "@/hooks/feature/use-workgroup";
import { ColumnDef } from "@tanstack/react-table";
import { ManageUserDialog } from "./ManageUserDialog";
import { ManageGroupDistributionDialog } from "./ManageGroupDistributionDialog";
import { ManageTaskDialog } from "./ManageTaskDialog";
import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";

export const WorkgroupDatatable = () => {
  const { data } = useWorkgroup();
  return <div>{data && <Datatable columns={columns} data={data.data} />}</div>;
};

const columns: ColumnDef<Workgroup["data"][0]>[] = [
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
  },
];
