"use client";

import { Datatable } from "@/components/datatable";
import { Badge } from "@/components/ui/badge";
import { Proposal, useProposal } from "@/hooks/feature/proposal/use-proposal";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const ProposalList = () => {
  const { data } = useProposal();
  return (
    <Datatable columns={columns} data={data?.data || []} initialPageSize={50} />
  );
};

enum StatusEnum {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  REVISIED = "REVISIED",
  WAITING = "WAITING",
}

const Status = (status: StatusEnum) => {
  switch (status) {
    case StatusEnum.ACCEPTED:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          ></span>
          Accepted
        </Badge>
      );

    case StatusEnum.REJECTED:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-red-500"
            aria-hidden="true"
          ></span>
          Rejected
        </Badge>
      );

    case StatusEnum.WAITING:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-yellow-500"
            aria-hidden="true"
          ></span>
          Waiting
        </Badge>
      );

    case StatusEnum.REVISIED:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-amber-500"
            aria-hidden="true"
          ></span>
          Revisied
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-gray-500"
            aria-hidden="true"
          ></span>
          Unkown
        </Badge>
      );
  }
};

const columns: ColumnDef<Proposal>[] = [
  {
    accessorKey: "Author.displayName",
    header: "Author",
  },
  {
    accessorKey: "title",
    header: "Proposal Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => Status(row.original.status),
  },
  {
    accessorKey: "Approver.displayName",
    header: "Approver",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(row.original.createdAt, "MMM dd, yyyy"),
  },
];
