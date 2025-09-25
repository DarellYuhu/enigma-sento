"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SentoClient } from "@/lib/sento-client";
import { cn } from "@/lib/utils";
import { getDownloadableResponse } from "@/utils/getDownloadableResponse";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import {
  Calendar,
  CheckIcon,
  CopyIcon,
  Download,
  Eye,
  ListOrdered,
  NotepadText,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileUploader } from "@/components/file-uploader";

export default function FolderDetailPage() {
  const link = typeof window !== "undefined" ? window.location.origin : "";
  const [selected, setSelected] = useState<string[]>([]);
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["bundles", { folder_id: id }],
    queryFn: async () => {
      const { data } = await SentoClient.get<Bundle[]>("bundles", {
        params: { folder_id: id },
      });
      return data;
    },
  });

  const toggleSelection = (id: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between">
        <CopyButton text={`${link}/folder/${id}`} />
        <DownloadDialog selected={selected} />
      </div>
      <div className="space-y-2">
        {data?.map((bundle) => (
          <div
            key={bundle.id}
            className="border-input has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-row gap-4 rounded-md border p-3 shadow-xs outline-none items-top"
          >
            <Checkbox
              id={bundle.id}
              value={bundle.id}
              className="order-0 after:absolute after:inset-0"
              checked={selected.includes(bundle.id)}
              onCheckedChange={(checked) =>
                toggleSelection(bundle.id, checked === true)
              }
            />
            <Label htmlFor={bundle.id} className="flex flex-row w-full">
              <div>
                <p>
                  {bundle.name}{" "}
                  <span className="text-gray-600">
                    ({bundle._count?.bundleFile} contents)
                  </span>
                </p>
                <p className="text-gray-600 mt-2">{bundle.notes}</p>
              </div>
              <p className="ml-auto flex flex-row items-center gap-2">
                <Calendar size={16} />{" "}
                {format(bundle.createdAt, "dd MMM yyyy hh:mm")}
              </p>
            </Label>
            <ViewDialog bundleId={bundle.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

const DownloadDialog = ({ selected }: { selected: string[] }) => {
  const [count, setCount] = useState(0);
  const [file, setFile] = useState<File>();
  const { mutate, isPending } = useMutation({
    mutationFn: async (body: {
      bundleIds: string[];
      count?: number;
      groupKeys?: File;
    }) => {
      const response = await SentoClient.post("bundles/download", body, {
        responseType: "blob",
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data?.size > 0) getDownloadableResponse(response);
    },
    onSuccess() {
      toast.success("Downloaded 🎉");
    },
    async onError(error) {
      if (error instanceof AxiosError)
        return toast.error(
          JSON.parse(await (error.response?.data as Blob).text())?.message,
        );
      toast.error("Something went wrong!");
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} disabled={selected.length === 0}>
          <Download /> Download
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download</DialogTitle>
          <DialogDescription>
            Download and grouping selected bundle into a certain count or group
            name
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="by-count"
          onValueChange={() => {
            setFile(undefined);
            setCount(0);
          }}
        >
          <ScrollArea>
            <TabsList className="bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
              <TabsTrigger
                value="by-count"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
              >
                <ListOrdered
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                By count
              </TabsTrigger>
              <TabsTrigger
                value="by-name"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
              >
                <ListOrdered
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                By group name
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="by-count">
            <Label>Group Count</Label>
            <Input
              placeholder="Count"
              value={count.toString()}
              type="number"
              onChange={(e) => setCount(+e.target.value)}
            />
          </TabsContent>
          <TabsContent value="by-name">
            <FileUploader
              maxSize={5 * 1024 * 1024}
              multiple={false}
              maxFiles={1}
              //accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onFilesChange={(file) =>
                file[0] ? setFile(file[0].file as File) : undefined
              }
            />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            disabled={isPending || (count <= 0 && !file)}
            onClick={() =>
              mutate({
                bundleIds: selected,
                count: count || undefined,
                groupKeys: file,
              })
            }
          >
            Submit
          </Button>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ViewDialog = ({ bundleId }: { bundleId: string }) => {
  const { data } = useQuery({
    queryKey: ["bundles", "images", { bundleId }],
    queryFn: async () => {
      const { data } = await SentoClient.get<Bundle>(`/bundles/${bundleId}`);
      return data;
    },
  });
  const [notes, setNotes] = useState(data?.notes ?? "");
  const { mutate } = useMutation({
    mutationFn: async () => {
      await SentoClient.patch(`/bundles/${bundleId}`, { notes });
    },
    onSuccess() {
      toast.success("Data updated successfully 🎉");
    },
    onError(error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data?.message);
      toast.error("Something went wrong!");
    },
  });
  useEffect(() => {
    if (data?.notes) setNotes(data.notes);
  }, [data?.notes]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="z-10" size={"sm"}>
          <Eye className={"size-20"} size={20} /> View
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px]">
        <DialogHeader>
          <DialogTitle>Images</DialogTitle>
        </DialogHeader>
        <div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <Button className="flex place-self-end mt-2" onClick={() => mutate()}>
            <NotepadText /> Set Notes
          </Button>
        </div>
        <ScrollArea className="h-[600px]">
          <div className="flex flex-row flex-wrap gap-2">
            {data?.bundleFile?.map((file) => (
              <div key={file.id}>
                <Image
                  src={file.url}
                  alt="bundle-image"
                  width={720}
                  height={720}
                  className="w-[300px] h-[200px] object-contain rounded-md border"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const id = useId();
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <div className="relative w-fit">
      <Input
        ref={inputRef}
        id={id}
        className="pe-9"
        type="text"
        defaultValue={text}
        readOnly
      />
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopy}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              disabled={copied}
            >
              <div
                className={cn(
                  "transition-all",
                  copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                )}
              >
                <CheckIcon
                  className="stroke-emerald-500"
                  size={16}
                  aria-hidden="true"
                />
              </div>
              <div
                className={cn(
                  "absolute transition-all",
                  copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                )}
              >
                <CopyIcon size={16} aria-hidden="true" />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            Copy to clipboard
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
