import { Datatable } from "@/components/datatable";
import {
  GroupDistribution,
  useGroupDistributions,
} from "@/hooks/feature/use-group-distributions";
import { ColumnDef } from "@tanstack/react-table";

export const GroupDistributionDatatable = () => {
  const { data } = useGroupDistributions();

  return (
    <div>
      <Datatable columns={columns} data={data?.data || []} />
    </div>
  );
};

const columns: ColumnDef<GroupDistribution>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "amontOfTroops",
    header: "Amount of troops",
  },
];
