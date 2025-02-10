import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CircleAlert, LoaderCircle, Trash2 } from "lucide-react";
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
import { useDeleteStory } from "@/hooks/feature/use-delete-story";
import { useState } from "react";

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
          {!status && (
            <>
              <GenerateContentDistributionAlert projectId={tabValue} />
              <CreateStoryDialog projectId={tabValue} />
            </>
          )}
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
              <p className="font-semibold">Text Position</p>
              <p>{item.textPosition}</p>
              <p className="font-semibold">Text Color</p>
              <Badge
                style={{
                  height: "20px",
                  backgroundColor: item.textColor,
                }}
              />
              <p className="font-semibold">Background Color</p>
              <Badge
                style={{
                  height: "20px",
                  backgroundColor: item.textBgColor ?? "white",
                }}
              />
              <p className="font-semibold">Text Overlay</p>
              <ScrollArea className="h-[200px] mt-0">
                {item.texts.map((text, idx) => (
                  <p
                    key={idx}
                    style={{
                      // color: item.textColor,
                      // backgroundColor: item.textBgColor ?? "",
                      color: "black",
                    }}
                  >
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
          {!status && (
            <div className="col-span-full">
              <DeleteStoryAlert storyId={story.id} />
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

const DeleteStoryAlert = ({ storyId }: { storyId: string }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteStory();

  const handleClick = () => {
    mutate(storyId, {
      onSuccess() {
        setOpen(false);
      },
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size={"icon"}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this story? All data related to
              this story will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick} disabled={isPending}>
            {isPending && (
              <LoaderCircle
                className="-ms-1 me-2 animate-spin"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
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
