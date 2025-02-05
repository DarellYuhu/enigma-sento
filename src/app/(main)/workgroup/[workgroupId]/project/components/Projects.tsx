"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/feature/use-projects";
import { Story } from "./Story";

export const Projects = () => {
  const { data } = useProjects();
  return (
    <Tabs>
      <TabsList>
        {data?.data.map((item) => (
          <TabsTrigger value={item.id} key={item.id}>
            {item.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {data?.data.map((item, idx) => (
        <Story
          value={{ id: item.id, status: item.status }}
          key={idx}
          idx={idx}
        />
      ))}
    </Tabs>
  );
};
