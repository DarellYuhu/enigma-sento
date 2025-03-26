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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  updateProjectSchema,
  UpdateProjectSchema,
  useUpdateProject,
} from "@/hooks/feature/project/use-update-project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";

export const EditNameDialog = ({ projectId }: { projectId: string }) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const { mutate, isPending } = useUpdateProject();
  const form = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (data: UpdateProjectSchema) => {
    mutate(
      { ...data, id: projectId },
      {
        onSuccess() {
          closeRef.current?.click();
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change Project Name</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Name</DialogTitle>
          <DialogDescription>Edit name of the project</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="new-name-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="new-name-form" disabled={isPending}>
            Save
          </Button>
          <DialogClose
            ref={closeRef}
            className={buttonVariants({ variant: "outline" })}
            form="new-name-form"
            type="reset"
          >
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
