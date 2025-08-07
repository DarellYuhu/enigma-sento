import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const CreateFolderForm = () => {
  const [name, setName] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await SentoClient.post("/folders", { name });
    },
    onSuccess() {
      toast.success("Folder created successfully 🎉");
    },
    onError(error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data?.message);
      toast.error("Something went wrong");
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          <Plus /> Create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new folder?</DialogTitle>
          <DialogDescription>Fill the field bellow</DialogDescription>
        </DialogHeader>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <DialogFooter>
          <Button disabled={name === "" || isPending} onClick={() => mutate()}>
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
