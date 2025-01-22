"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/feature/use-proejcts";
import { Story } from "./Story";

export const Projects = () => {
  const { data } = useProjects();
  return (
    <div>
      <Tabs defaultValue="tab-1">
        <TabsList>
          {data?.data.map((item) => (
            <TabsTrigger value={item.id} key={item.id}>
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {data?.data.map((item, idx) => (
          <Story value={item.id} key={idx} />
        ))}
      </Tabs>
    </div>
  );
};
