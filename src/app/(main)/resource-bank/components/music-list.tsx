"use client";

import { Datatable } from "@/components/datatable";
import { useMusics } from "@/hooks/feature/use-musics";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const MusicList = () => {
  const { data } = useMusics();

  return (
    <>
      <div>
        <Datatable columns={columns} data={data?.data ?? []} />
      </div>
      {/* <AudioPlayer
        src={data?.data[0].path}
        className="absolute bottom-0"
        ref={playerRef}
      /> */}
    </>
  );
};

type Data = NonNullable<ReturnType<typeof useMusics>["data"]>["data"][0];
const columns: ColumnDef<Data>[] = [
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
