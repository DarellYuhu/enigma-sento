"use client";

import { useProposal } from "@/hooks/feature/proposal/use-proposal";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Feedback } from "./components/feedback";
import { Status } from "../components/status";
import { ReuploadDialog } from "./components/reupload-dialog";
import { StatusEnum } from "@/types/enums";

export default function ProposalDetailPage() {
  const [selected, setSelected] = useState(0);
  const { data } = useProposal();

  return (
    <div className="space-y-4">
      {data && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <CardTitle>{data.data.title}</CardTitle>
              <CardDescription>{`Proposed by: ${data.data.Author.displayName}`}</CardDescription>
            </div>
            <Status status={data.data.status} />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className=" flex flex-row gap-2">
              <Select
                value={selected.toString()}
                onValueChange={(val) => setSelected(+val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select submission" />
                </SelectTrigger>
                <SelectContent>
                  {data.data.Submission.map((item, idx) => (
                    <SelectItem value={idx.toString()} key={idx}>
                      Submission{" "}
                      {format(new Date(item.createdAt), "yyyy-MM-dd 'at' p")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {data.data.status === StatusEnum.REVISIED && <ReuploadDialog />}
            </div>
            <ScrollArea className="h-[600px]">
              <DocViewer
                prefetchMethod="GET"
                pluginRenderers={DocViewerRenderers}
                documents={[{ uri: data.data.Submission[selected].uri }]}
                config={{
                  pdfZoom: {
                    defaultZoom: 0.7,
                    zoomJump: 0.3,
                  },
                }}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      <Feedback selected={selected} />
    </div>
  );
}
