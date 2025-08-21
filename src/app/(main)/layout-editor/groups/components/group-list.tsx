"use client";

import { Datatable } from "@/components/datatable";
import { Button } from "@/components/ui/button";
import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RiImageCircleAiFill } from "react-icons/ri";

export const GroupList = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const { data } = useQuery({
    queryKey: ["layouts", "groups", { search }],
    async queryFn() {
      const { data } = await SentoClient.get<LayoutGroup[]>("layout-groups", {
        params: { search },
      });
      return data;
    },
  });

  return <Datatable columns={columns} data={data ?? []} />;
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
