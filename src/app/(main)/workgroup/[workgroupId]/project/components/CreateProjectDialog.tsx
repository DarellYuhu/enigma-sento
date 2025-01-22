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
import { useCreateProject } from "@/hooks/feature/use-create-project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({ name: z.string().trim().min(1, "Required") });
type FormSchema = z.infer<typeof formSchema>;

export const CreateProjectDialog = () => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { mutateAsync } = useCreateProject();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const handleSubmit = async (value: FormSchema) => {
    await mutateAsync(value).then(() => closeBtnRef.current?.click());
  };

  return (
    <Dialog onOpenChange={() => form.reset()}>
      <DialogTrigger className={buttonVariants()}>Create Project</DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create a new project?</DialogTitle>
            <DialogDescription>
              Please fill all the fields below to create a new project
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
          <DialogFooter>
            <Button type="submit">Submit</Button>
            <DialogClose
              className={buttonVariants({ variant: "outline" })}
              ref={closeBtnRef}
            >
              Cancel
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
