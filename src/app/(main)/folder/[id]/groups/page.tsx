"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function GroupPage() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["generated-groups"],
    queryFn: async () => {
      const { data } = await SentoClient.get<GeneratedGroup[]>(
        `/folders/${id}/generated-groups`,
      );
      return data;
    },
  });
  return (
    <div>
      <Accordion type="single" collapsible>
        {data?.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.name}</AccordionTrigger>
            <AccordionContent className="space-y-2.5">
              {item.groups.map((group, idx) => (
                <label
                  key={idx}
                  className="border p-3 flex flex-row gap-4 rounded-md items-center"
                >
                  <Checkbox name={`group-${idx}`} />
                  <p>{group}</p>
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
