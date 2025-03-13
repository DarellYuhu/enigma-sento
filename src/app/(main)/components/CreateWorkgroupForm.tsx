"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
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
  createWorkgroup,
  CreateWorkgroup,
  useCreateWorkgroup,
} from "@/hooks/feature/workgroup/use-create-workgroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const CreateWorkgroupForm = () => {
  const { mutate, isPending } = useCreateWorkgroup();
  const cluseBtnRef = useRef<HTMLButtonElement>(null);
  const form = useForm<CreateWorkgroup>({
    resolver: zodResolver(createWorkgroup),
    defaultValues: {
      name: "",
      projectStoryPerUser: 0,
      session: 0,
    },
  });

  const handleFormSubmittion = (data: CreateWorkgroup) => {
    mutate(data, {
      onSuccess() {
        toast.success("Workgroup created!");
        cluseBtnRef.current?.click();
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmittion)}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workgroup name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectStoryPerUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project story per user</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="session"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount of session</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
          <DialogClose
            type="button"
            ref={cluseBtnRef}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
};
