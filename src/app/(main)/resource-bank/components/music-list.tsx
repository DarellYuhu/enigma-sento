"use client";

import { Datatable } from "@/components/datatable";
import { Checkbox } from "@/components/ui/checkbox";
import { useMusics } from "@/hooks/feature/use-musics";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const MusicList = ({
  onRowSelect,
}: {
  onRowSelect?: (values: Data[]) => void;
}) => {
  const { data } = useMusics();

  return (
    <>
      <div>
        <Datatable
          columns={columns}
          data={data?.data ?? []}
          onRowSelect={onRowSelect}
          enableMultiRowSelection={true}
        />
      </div>
    </>
  );
};

type Data = NonNullable<ReturnType<typeof useMusics>["data"]>["data"][0];

const columns: ColumnDef<Data>[] = [
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
    id: "no",
    header: "#",
    cell({ row }) {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "addedAt",
    header: "Date Added",
    cell({ row }) {
      return format(row.original.addedAt, "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell({ row }) {
      return format(row.original.duration * 1000, "mm:ss");
    },
  },
];
