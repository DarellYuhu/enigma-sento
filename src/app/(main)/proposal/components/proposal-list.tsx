"use client";

import { Datatable } from "@/components/datatable";
import { badgeVariants } from "@/components/ui/badge";
import { Proposal, useProposals } from "@/hooks/feature/proposal/use-proposals";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { Status } from "./status";

export const ProposalList = () => {
  const { data } = useProposals();
  return (
    <Datatable columns={columns} data={data?.data || []} initialPageSize={50} />
  );
};

const columns: ColumnDef<Proposal>[] = [
  {
    accessorKey: "Author.displayName",
    header: "Author",
  },
  {
    accessorKey: "title",
    header: "Proposal Name",
    cell({ row }) {
      return (
        <Link className={badgeVariants()} href={`/proposal/${row.original.id}`}>
          {row.original.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Status status={row.original.status} />,
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
