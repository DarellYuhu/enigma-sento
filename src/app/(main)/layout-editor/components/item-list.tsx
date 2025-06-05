"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { PiEyeBold } from "react-icons/pi";
import { create } from "zustand";

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
          <Button
            size={"icon"}
            className="size-7 ml-auto group-hover:visible invisible transition-all duration-100 opacity-0 group-hover:opacity-100"
            asChild
          >
            <Link
              href={`/layout-editor/${item.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <PiEyeBold size={1} />
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
};
