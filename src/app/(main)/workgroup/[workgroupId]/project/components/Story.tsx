import { TabsContent } from "@/components/ui/tabs";
import { CreateStoryDialog } from "./CreateStoryDialog";
import { Story as TStory } from "@/hooks/feature/use-projects";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GenerateContentDistributionAlert } from "./GenerateContentDistributionAlert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditCaptionsDialog } from "./EditCaptionsDialog";
import { EditHashtagsDialog } from "./EditHashtagsDialog";
import { UserGeneratedContentForm } from "./UserGeneratedContentForm";
import { GenerateContentButton } from "./GenerateContentButton";
import { Check } from "lucide-react";

export const Story = ({
  story,
  tabValue,
  status,
}: {
  story: TStory[];
  tabValue: string;
  status: boolean;
}) => {
  return (
    <TabsContent value={tabValue} className="border-2 rounded-md space-y-3 p-3">
      <div className="flex flex-row justify-between">
        <Badge variant={"outline"} color={status ? "red" : "green"}>
          {status ? "Allocated" : "Draft"}
        </Badge>
        <div className="space-x-2">
          <GenerateContentDistributionAlert projectId={tabValue} />
          {!status && <CreateStoryDialog projectId={tabValue} />}
        </div>
      </div>
      {story.map((story, idx) => (
        <div className="grid grid-cols-4 gap-3 p-4 border-b-2" key={idx}>
          <div className="col-span-4 flex flex-row justify-between">
            <p className="font-semibold">Story {idx + 1}</p>
            <div className="space-x-3">
              <GeneratorBadge status={story.generatorStatus} />
              <Badge variant={"secondary"}>
                {storyType[story.type as keyof typeof storyType]}
              </Badge>
              <Badge variant={"secondary"}>
                Required captions & generated content: {story.captions.length}/
                {story.contentPerStory ?? "-"}
              </Badge>
            </div>
          </div>
          <div className="col-span-full grid grid-cols-2 gap-3">
            <Card>
              <CardHeader className="flex flex-row justify-between border-b-2 items-center">
                <CardTitle>Captions</CardTitle>
                <EditCaptionsDialog storyId={story.id} />
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[100px]">
                  <p>{story.captions.join("\n")}</p>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between border-b-2 items-center">
                <CardTitle>Hashtags</CardTitle>
                <EditHashtagsDialog storyId={story.id} />
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[100px]">{story.hashtags}</ScrollArea>
              </CardContent>
            </Card>
          </div>
          {story.data?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 space-y-2 border-2 shadow-md rounded-md"
            >
              <Carousel>
                <CarouselContent>
                  {item.images.map((image, idx) => (
                    <CarouselItem key={idx}>
                      <Image
                        className="size-44 object-cover w-full rounded-md border-2"
                        src={image}
                        alt="story_img"
                        width={1080}
                        height={1080}
                        key={idx}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3" />
                <CarouselNext className="right-3" />
              </Carousel>
              <p className="font-semibold">
                <span className="font-normal">Text Position: </span>
                {item.textPosition}
              </p>
              <ScrollArea className="h-[200px]">
                {item.texts.map((text, idx) => (
                  <p key={idx} style={{ color: item.textColor }}>
                    {text}
                  </p>
                ))}
              </ScrollArea>
            </div>
          ))}
          {story.contentPerStory && story.type === "USER_GENERATE" && (
            <UserGeneratedContentForm
              storyId={story.id}
              fileLength={story.contentPerStory}
            />
          )}
          {story.type === "SYSTEM_GENERATE" &&
            story.contentPerStory !== null && (
              <div className="col-span-full">
                <GenerateContentButton storyId={story.id} />
              </div>
            )}
        </div>
      ))}
    </TabsContent>
  );
};

const GeneratorBadge = ({
  status,
}: {
  status: keyof typeof generatorStatus;
}) => {
  switch (status) {
    case "FINISHED":
      return (
        <Badge variant="outline" className="gap-1.5">
          <Check
            className="text-emerald-500"
            size={12}
            strokeWidth={2}
            aria-hidden="true"
          />
          {generatorStatus[status]}
        </Badge>
      );
    case "RUNNING":
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-amber-500"
            aria-hidden="true"
          ></span>
          {generatorStatus[status]}
        </Badge>
      );
    case "ERROR":
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-red-500"
            aria-hidden="true"
          ></span>
          {generatorStatus[status]}
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-slate-500"
            aria-hidden="true"
          ></span>
          {generatorStatus[status]}
        </Badge>
      );
  }
};

const generatorStatus = {
  NOT_GENERATE: "Not Generate",
  RUNNING: "Running",
  FINISHED: "Finished",
  ERROR: "Error Generating",
};

const storyType = {
  USER_GENERATE: "User Generate",
  SYSTEM_GENERATE: "System Generate",
};
