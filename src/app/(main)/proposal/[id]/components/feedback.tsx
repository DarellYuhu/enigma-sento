import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateStatus } from "@/hooks/feature/proposal/use-update-status";
import { StatusEnum } from "@/types/enums";
import { useProposal } from "@/hooks/feature/proposal/use-proposal";
import {
  Ban,
  CircleX,
  FileWarning,
  Paperclip,
  TicketCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export const Feedback = ({ selected }: { selected: number }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File>();
  const { mutate, isPending } = useUpdateStatus();
  const { data } = useProposal();

  const handleUpdateStatus = (status: StatusEnum) => {
    const submissionId = data!.data.Submission[selected].id;
    mutate({ file, message, submissionId, status });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {data?.data.Feedback.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div>
                <p className="font-semibold text-sm">{item.User.displayName}</p>
                <p className="text-xs">
                  {format(item.createdAt, "MMM dd, yyyy 'at' p")}
                </p>
              </div>
              <Textarea
                className="read-only:bg-muted"
                readOnly
                value={item.message}
              />
              {item.uri && (
                <Dialog>
                  <DialogTrigger
                    className={`${buttonVariants({
                      size: "sm",
                    })} self-end`}
                  >
                    View Attachment
                  </DialogTrigger>
                  <DialogContent className="min-w-[900px]">
                    <DialogHeader>
                      <DialogTitle>Attached File</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[520px]">
                      <DocViewer
                        prefetchMethod="GET"
                        pluginRenderers={DocViewerRenderers}
                        documents={[{ uri: item.uri }]}
                      />
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <Textarea rows={4} onChange={(e) => setMessage(e.target.value)} />
          <div className="flex flex-row gap-1 items-center">
            {!file ? (
              <>
                <Input
                  className="hidden"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0])}
                  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Paperclip />
                  Attach File
                </Button>
              </>
            ) : (
              <div className="flex flex-row gap-1 items-center">
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => setFile(undefined)}
                  className="border-red-400 text-red-400 hover:text-red-400"
                >
                  <CircleX />
                </Button>
                <p className="text-sm text-muted-foreground">{file.name}</p>
              </div>
            )}
          </div>
          <div className="flex flex-row gap-1">
            <Button
              variant={"outline"}
              className="border"
              onClick={() => handleUpdateStatus(StatusEnum.ACCEPTED)}
              disabled={isPending}
            >
              <TicketCheck />
              Approve
            </Button>
            <Button
              variant={"outline"}
              onClick={() => handleUpdateStatus(StatusEnum.REJECTED)}
              disabled={isPending}
            >
              <Ban />
              Reject
            </Button>
            <Button
              variant={"outline"}
              onClick={() => handleUpdateStatus(StatusEnum.REVISIED)}
              disabled={isPending}
            >
              <FileWarning />
              Need Revisions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
