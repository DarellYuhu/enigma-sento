"use client";

import { Datatable } from "@/components/datatable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { RiImageCircleAiFill } from "react-icons/ri";

export const GroupList = ({ list }: { list: LayoutGroup[] }) => {
  return <Datatable columns={columns} data={list} />;
};

const columns: ColumnDef<LayoutGroup>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "layoutCount",
    header: "Layout Count",
  },
  {
    id: "actions",
    header: "Actions",
    cell(props) {
      return (
        <Button asChild size={"sm"}>
          <Link
            href={`?id=${props.row.original.id}`}
            scroll={false}
            shallow={true}
          >
            <RiImageCircleAiFill /> Generate
          </Link>
        </Button>
      );
    },
  },
];
