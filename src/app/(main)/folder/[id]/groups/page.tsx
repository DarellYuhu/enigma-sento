"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Download } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
        {data?.map((item, idx) => <GroupItem key={idx} item={item} />)}
      </Accordion>
    </div>
  );
}

const GroupItem = ({ item }: { item: GeneratedGroup }) => {
  const { id } = useParams();
  const [selected, setSelected] = useState<string[]>([]);
  const handleCheck = (checked: boolean | "indeterminate", group: string) => {
    setSelected((prev) => {
      if (checked) {
        return prev.includes(group) ? prev : [...prev, group];
      } else {
        return prev.filter((g) => g !== group);
      }
    });
  };
  const { mutate: handleDownload } = useMutation({
    mutationFn: async (payload: {
      generatedGroup: string;
      groups: string[];
    }) => {
      const { data } = await SentoClient.post<string>(
        `/folders/${id}/download`,
        payload,
      );
      const link = document.createElement("a");
      link.href = data;
      link.setAttribute("download", "archive.zip"); // optional custom filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onSuccess() {
      toast.success("File is being download 🎉");
    },
    onError(error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data?.message);
      toast.error("Something went wrong");
    },
  });
  return (
    <AccordionItem key={item.id} value={item.id}>
      <AccordionTrigger>{item.name}</AccordionTrigger>
      <AccordionContent className="space-y-2.5">
        <Button
          disabled={selected.length === 0}
          size={"sm"}
          onClick={() =>
            handleDownload({ groups: selected, generatedGroup: item.id })
          }
        >
          <Download /> Download
        </Button>
        {item.groups.map((group, idx) => (
          <label
            key={idx}
            className="border p-3 flex flex-row gap-4 rounded-md items-center"
          >
            <Checkbox
              name={`group-${idx}`}
              onCheckedChange={(c) => handleCheck(c, group)}
            />
            <p>{group}</p>
          </label>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};
