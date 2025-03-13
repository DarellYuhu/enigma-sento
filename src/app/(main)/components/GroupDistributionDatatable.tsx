import { Datatable } from "@/components/datatable";
import {
  GroupDistribution,
  useGroupDistributions,
} from "@/hooks/feature/workgroup/use-group-distributions";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteGroupDistributionAlert } from "./DeleteGroupDistributionAlert";

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
  {
    id: "actions",
    cell({ row }) {
      return <DeleteGroupDistributionAlert id={row.original.id} />;
    },
  },
];
