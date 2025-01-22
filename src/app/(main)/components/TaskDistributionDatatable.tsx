import { Datatable } from "@/components/datatable";
import { Badge } from "@/components/ui/badge";
import {
  useTaskDistribution,
  WorkgroupUserTasks,
} from "@/hooks/feature/use-task-distribution";
import { ColumnDef } from "@tanstack/react-table";

export const TaskDistributionDatatable = () => {
  const { data } = useTaskDistribution();
  return (
    <div>
      <Datatable columns={columns} data={data || []} />
    </div>
  );
};

const columns: ColumnDef<WorkgroupUserTasks>[] = [
  {
    accessorKey: "displayName",
    header: "Name",
    cell(props) {
      return <p className="text-nowrap">{props.row.original.displayName}</p>;
    },
  },
  {
    accessorKey: "distributions",
    header: "Group Distributions",
    cell(props) {
      return (
        <div className="flex flex-row gap-2 flex-wrap">
          {props.row.original.distributions.map((distribution, idx) => (
            <Badge key={idx}>{distribution.code}</Badge>
          ))}
        </div>
      );
    },
  },
];
