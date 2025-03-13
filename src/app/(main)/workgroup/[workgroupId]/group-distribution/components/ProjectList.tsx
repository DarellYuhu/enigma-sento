import { Datatable } from "@/components/datatable";
import { DownloadContentButton } from "./DownloadContentButton";
import { useState } from "react";
import {
  GroupDistribution,
  Projects,
} from "@/hooks/feature/workgroup/use-group-distributions";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export const ProjectList = ({ item }: { item: GroupDistribution }) => {
  const [selected, setSelected] = useState<Projects[]>([]);

  return (
    <div className="space-y-4">
      <DownloadContentButton
        groupDistributionId={item.id}
        projectIds={selected.map((item) => item.id)}
      />
      <Datatable
        columns={columns}
        data={item.projects}
        enableMultiRowSelection={true}
        onRowSelect={setSelected}
      />
    </div>
  );
};

const columns: ColumnDef<Projects>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
