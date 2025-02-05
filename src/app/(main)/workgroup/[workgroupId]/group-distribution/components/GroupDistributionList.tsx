"use client";

import { Datatable } from "@/components/datatable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Projects,
  useGroupDistributions,
} from "@/hooks/feature/use-group-distributions";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DownloadContentButton } from "./DownloadContentButton";
import { ProjectList } from "./ProjectList";

export const GroupDistributionList = () => {
  const { data } = useGroupDistributions();

  return (
    <Accordion type="multiple" className="w-full -space-y-px">
      {data?.data.map((item, idx) => (
        <AccordionItem
          value={idx.toString()}
          key={idx}
          className="border bg-background px-4 py-1 first:rounded-t-lg last:rounded-b-lg"
        >
          <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline">
            {item.code}
          </AccordionTrigger>
          <AccordionContent className="pb-2 text-muted-foreground">
            <ProjectList item={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
