"use client";

import { Datatable } from "@/components/datatable";
import { Font, useFonts } from "@/hooks/feature/use-fonts";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteFontAllert } from "./delete-font-alert";

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
  {
    id: "actions",
    cell({ row }) {
      return <DeleteFontAllert id={row.original._id} />;
    },
  },
];
