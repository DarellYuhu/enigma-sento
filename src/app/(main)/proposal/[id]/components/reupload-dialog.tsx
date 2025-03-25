import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
import { useCreateSubmission } from "@/hooks/feature/proposal/use-create-submission";
import { useState } from "react";
import { toast } from "sonner";

export const ReuploadDialog = () => {
  const [file, setFile] = useState<File[]>([]);
  const { mutate, isPending } = useCreateSubmission();

  const handleSubmit = () => {
    if (!file[0]) return toast.error("Please select a file");
    mutate({ file: file[0] });
  };

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants()}>
        Upload Revision
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Revision</DialogTitle>
        </DialogHeader>
        <FileUploader
          maxSize={1024 * 1024 * 10}
          multiple={false}
          onValueChange={(file) => setFile(file)}
          value={file}
          accept={{
            "application/pdf": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [],
            "application/vnd.openxmlformats-officedocument.presentationml.presentation":
              [],
          }}
        />
        <DialogFooter>
          <Button disabled={isPending} onClick={handleSubmit}>
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
