"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/feature/project/use-projects";
import { Story } from "./Story";
import { Badge } from "@/components/ui/badge";
import { GenerateContentDistributionAlert } from "./GenerateContentDistributionAlert";
import { CreateStoryDialog } from "./CreateStoryDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const Projects = () => {
  const { data } = useProjects();
  return (
    <Tabs>
      <div className="flex">
        <ScrollArea className="w-1 flex-1 pb-4">
          <TabsList>
            {data?.data.map((item) => (
              <TabsTrigger value={item.id} key={item.id}>
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {data?.data.map((item, idx) => (
        <TabsContent
          key={idx}
          value={item.id}
          className="border-2 rounded-md space-y-3 p-3"
        >
          <div className="flex flex-row justify-between">
            <div className="space-x-2 self-center">
              <Badge variant={"outline"} color={item.status ? "red" : "green"}>
                {item.status ? "Allocated" : "Draft"}
              </Badge>
              <Badge variant={"outline"}>{item.allocationType}</Badge>
            </div>
            <div className="space-x-2">
              {!item.status && (
                <>
                  <GenerateContentDistributionAlert projectId={item.id} />
                  <CreateStoryDialog projectId={item.id} />
                </>
              )}
            </div>
          </div>
          {item.allocationType === "GENERIC" && (
            <div className="col-span-full grid grid-cols-2 gap-3">
              <Card>
                <CardHeader className="flex flex-row justify-between border-b-2 items-center">
                  <CardTitle>Captions</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[100px]">
                    <p>{item.captions?.join("\n")}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row justify-between border-b-2 items-center">
                  <CardTitle>Hashtags</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[100px]">{item.hashtags}</ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
          <Story
            stories={item.Story}
            status={item.status}
            allocationType={item.allocationType}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
