import { Datatable } from "@/components/datatable";
import {
  useWorkgroupUser,
  WorkgroupUser,
} from "@/hooks/feature/use-workgroup-user";
import { ColumnDef } from "@tanstack/react-table";

export const WorkgroupUserDatatable = () => {
  const { data } = useWorkgroupUser();

  return (
    <div>
      <Datatable columns={columns} data={data?.data || []} />
    </div>
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
];
