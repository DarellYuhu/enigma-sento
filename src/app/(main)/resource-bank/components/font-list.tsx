"use client";

import { Datatable } from "@/components/datatable";
import { Font, useFonts } from "@/hooks/feature/use-fonts";
import { ColumnDef } from "@tanstack/react-table";

export const FontList = () => {
  const { data } = useFonts();

  return (
    <div>
      <Datatable columns={columns} data={data?.data ?? []} />
    </div>
  );
};

const columns: ColumnDef<Font>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "name",
    header: "Font Name",
  },
];
