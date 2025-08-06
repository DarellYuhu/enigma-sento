"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { create } from "zustand";
import { EllipsisVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PiEyeBold } from "react-icons/pi";
import Link from "next/link";
import { DeleteLayoutAlert } from "./delete-layout-alert";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type State = {
  selected: number[];
};

type Action = {
  setSelected: (selected: number[]) => void;
};

export const useSelectionStore = create<State & Action>((set) => ({
  selected: [],
  setSelected: (selected) => set({ selected }),
}));

export const ItemList = ({ data }: { data: Layout[] }) => {
  const { selected, setSelected } = useSelectionStore();

  return (
    <div className="grid grid-cols-5 flex-wrap gap-2">
      {data.map((item) => (
        <div
          className="group border p-2 rounded-md shadow-md relative flex gap-2 has-[[aria-checked=true]]:border-green-500 cursor-pointer"
          key={item.id}
          onClick={() => {
            if (selected.includes(item.id)) {
              setSelected(selected.filter((id) => id !== item.id));
            } else {
              setSelected([...selected, item.id]);
            }
          }}
        >
          <Checkbox checked={selected.includes(item.id)} className="hidden" />
          <div>
            <p className="font-semibold text-base">{item.name}</p>
            <p className="text-xs">{item.creator.displayName}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"icon"}
                variant={"outline"}
                className="size-6 ml-auto group-hover:visible invisible transition-all duration-100 opacity-0 group-hover:opacity-100"
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/layout-editor/${item.id}`}>
                <DropdownMenuItem>
                  <PiEyeBold /> View
                </DropdownMenuItem>
              </Link>
              {/* <Link href={`/layout-editor/${item.id}/edit`}> */}
              {/*   <DropdownMenuItem> */}
              {/*     <Pencil /> Edit */}
              {/*   </DropdownMenuItem> */}
              {/* </Link> */}
              <DeleteLayoutAlert id={item.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};
