import { Datatable } from "@/components/datatable";
import { Badge } from "@/components/ui/badge";
import {
  useTaskDistribution,
  WorkgroupUserTasks,
} from "@/hooks/feature/use-task-distribution";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useId, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FileDown, LoaderCircle } from "lucide-react";
import { useExportTaskDistribution } from "@/hooks/feature/use-export-task-distribution";

export const TaskDistributionDatatable = () => {
  const id = useId();
  const { mutate, isPending } = useExportTaskDistribution();
  const [index, setIndex] = useState("");
  const { data } = useTaskDistribution();

  useEffect(() => {
    if (data) {
      setIndex(
        Object.values(data.data)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0]
          ?.id.toString()
      );
    }
  }, [data]);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Select onValueChange={setIndex}>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Select Distribution History" />
          </SelectTrigger>
          <SelectContent>
            {data &&
              Object.values(data.data)
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((item) => (
                  <SelectItem value={item.id.toString()} key={item.id}>
                    {format(item.createdAt, "dd MMMM yyyy HH:mm")}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
        <Button disabled={isPending} onClick={() => mutate(index)}>
          {isPending ? (
            <LoaderCircle
              className="-ms-1 me-2 animate-spin"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          ) : (
            <FileDown />
          )}
          Export
        </Button>
      </div>
      <Datatable columns={columns} data={data?.data[index]?.users || []} />
    </>
  );
};

const columns: ColumnDef<WorkgroupUserTasks>[] = [
  {
    accessorKey: "displayName",
    header: "Name",
    cell(props) {
      return <p className="text-nowrap">{props.row.original.displayName}</p>;
    },
  },
  {
    accessorKey: "distributions",
    header: "Group Distributions",
    cell(props) {
      return (
        <div className="flex flex-row gap-2 flex-wrap">
          {props.row.original.distributions.map((distribution, idx) => (
            <Badge key={idx}>{distribution.code}</Badge>
          ))}
        </div>
      );
    },
  },
];
