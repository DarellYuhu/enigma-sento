"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/feature/use-projects";
import { Story } from "./Story";

export const Projects = () => {
  const { data } = useProjects();
  return (
    <div>
      <Tabs className="m-3 p-3">
        <TabsList>
          {data?.data.map((item) => (
            <TabsTrigger value={item.id} key={item.id}>
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {data?.data.map((item, idx) => (
          <Story value={item.id} key={idx} idx={idx} />
        ))}
      </Tabs>
    </div>
  );
};
