import { Datatable } from "@/components/datatable";
import { Font, useFonts } from "@/hooks/feature/asset/use-fonts";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteFontAllert } from "./delete-font-alert";
import { Checkbox } from "@/components/ui/checkbox";

export const FontList = ({
  onRowSelect,
}: {
  onRowSelect?: (values: Font[]) => void;
}) => {
  const { data } = useFonts();

  return (
    <div>
      <Datatable
        columns={columns}
        data={data?.data ?? []}
        onRowSelect={onRowSelect}
        enableMultiRowSelection={true}
      />
    </div>
  );
};

const columns: ColumnDef<Font>[] = [
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
    accessorKey: "id",
    header: "#",
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Font Name",
  },
  {
    id: "actions",
    cell({ row }) {
      return <DeleteFontAllert id={row.original._id} />;
    },
  },
];
