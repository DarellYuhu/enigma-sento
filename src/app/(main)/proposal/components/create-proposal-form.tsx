"use client";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { FileUploader } from "@/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createProposalSchema,
  CreateProposalSchema,
  useCreateProposal,
} from "@/hooks/feature/proposal/use-create-proposal";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";

export const CreateProposalForm = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { mutate, isPending } = useCreateProposal();
  const form = useForm<CreateProposalSchema>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      file: [],
      title: "",
    },
  });

  const onSubmit = async (data: CreateProposalSchema) => {
    mutate(data, { onSuccess: () => closeRef.current?.click() });
  };

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants()}>
        Create Proposal
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new proposal</DialogTitle>
          <DialogDescription>
            This proposal is required for workspace that need a tiket. Plase
            fill the requirement&apos;s below
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="create-proposal"
            onReset={() => form.reset()}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Proposal Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <FileUploader
                      maxSize={1024 * 1024 * 10}
                      multiple={false}
                      onValueChange={field.onChange}
                      value={field.value}
                      accept={{
                        "application/pdf": [],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                          [],
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                          [],
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Accept PDF, Word, or PowerPoint
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="create-proposal" disabled={isPending}>
            {isPending && (
              <LoaderCircleIcon
                className="-ms-1 animate-spin"
                size={16}
                aria-hidden="true"
              />
            )}
            Create
          </Button>
          <DialogClose asChild ref={closeRef}>
            <Button variant={"outline"} type="reset" form="create-proposal">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
