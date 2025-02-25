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
import { Story as TStory } from "@/hooks/feature/use-projects";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditCaptionsDialog } from "./EditCaptionsDialog";
import { EditHashtagsDialog } from "./EditHashtagsDialog";
import { UserGeneratedContentForm } from "./UserGeneratedContentForm";
import { GenerateContentButton } from "./GenerateContentButton";
import { Check } from "lucide-react";
import { useDeleteStory } from "@/hooks/feature/use-delete-story";
import { Fragment, useState } from "react";
import { SectionCard } from "./SectionCard";
import { Separator } from "@/components/ui/separator";

export const Story = ({
  story,
  status,
  allocationType,
}: {
  story: TStory[];
  status: boolean;
  allocationType: "GENERIC" | "SPECIFIC";
}) => {
  return (
    <>
      {story.map((item, idx) => (
        <Fragment key={idx}>
          <div className="grid grid-cols-4 gap-3 p-4">
            <div className="col-span-4 flex flex-row justify-between">
              <p className="font-semibold">Story {idx + 1}</p>
              <div className="space-x-3">
                <GeneratorBadge status={item.generatorStatus} />
                <Badge variant={"secondary"}>
                  {storyType[item.type as keyof typeof storyType]}
                </Badge>
                <Badge variant={"secondary"}>
                  Generated Contents: {item.contentPerStory ?? "-"}
                </Badge>
              </div>
            </div>
            {allocationType === "SPECIFIC" && (
              <div className="col-span-full grid grid-cols-2 gap-3">
                <Card>
                  <CardHeader className="flex flex-row justify-between border-b-2 items-center">
                    <CardTitle>Captions</CardTitle>
                    <EditCaptionsDialog storyId={item._id} />
                  </CardHeader>
                  <CardContent className="p-2">
                    <ScrollArea className="h-[100px]">
                      <p>{item.captions.join("\n")}</p>
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row justify-between border-b-2 items-center">
                    <CardTitle>Hashtags</CardTitle>
                    <EditHashtagsDialog storyId={item._id} />
                  </CardHeader>
                  <CardContent className="p-2">
                    <ScrollArea className="h-[100px]">
                      {item.hashtags}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
            {item.data?.map((item, idx) => (
              <SectionCard item={item} key={idx} storyId={item._id} />
            ))}
            {item.contentPerStory && item.type === "USER_GENERATE" && (
              <UserGeneratedContentForm
                storyId={item._id}
                fileLength={item.contentPerStory}
              />
            )}
            {status && item.type === "SYSTEM_GENERATE" && (
              <div className="col-span-full">
                <GenerateContentButton storyId={item._id} />
              </div>
            )}
            {!status && (
              <div className="col-span-full">
                <DeleteStoryAlert storyId={item._id} />
              </div>
            )}
          </div>
          {idx !== story.length - 1 && (
            <Separator orientation="horizontal" className="w-full h-1" />
          )}
        </Fragment>
      ))}
    </>
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
