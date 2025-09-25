"use client";

import { useId } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DateRangePicker({
  selected,
  onSelect,
}: {
  selected?: DateRange;
  onSelect?: (val: DateRange) => void;
}) {
  const id = useId();

  return (
    <div className="*:not-first:mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span
              className={cn("truncate", !selected && "text-muted-foreground")}
            >
              {selected?.from ? (
                selected.to ? (
                  <>
                    {format(selected.from, "LLL dd, y")} -{" "}
                    {format(selected.to, "LLL dd, y")}
                  </>
                ) : (
                  format(selected.from, "LLL dd, y")
                )
              ) : (
                "Pick a date range"
              )}
            </span>
            <CalendarIcon
              size={16}
              className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          {/* <Calendar mode="range" selected={selected} onSelect={onSelect} /> */}
          <Calendar
            mode="range"
            selected={selected}
            onSelect={(val) => onSelect && val && onSelect(val)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
