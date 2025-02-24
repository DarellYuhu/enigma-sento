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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "@/hooks/feature/use-create-project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Required")
      .refine(
        (value) => !/[^a-zA-Z0-9_-]/.test(value),
        "Name can only contain letters, numbers, underscores, and dashes"
      ),
    allocationType: z.string().trim().min(1, "Required"),
    captions: z.string().optional(),
    hashtags: z.string().optional(),
  })
  .superRefine(({ allocationType, captions, hashtags }, ctx) => {
    if (allocationType === "GENERIC") {
      if (!captions) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["captions"],
          message: "Captions are required for GENERIC allocation type",
        });
      }
      if (!hashtags) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["hashtags"],
          message: "Hashtags are required for GENERIC allocation type",
        });
      }
    }
  });
type FormSchema = z.infer<typeof formSchema>;

export const CreateProjectDialog = () => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { mutate } = useCreateProject();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", allocationType: "GENERIC", captions: "" },
  });

  const handleSubmit = (value: FormSchema) => {
    mutate(value, {
      onSuccess() {
        closeBtnRef.current?.click();
      },
    });
  };

  return (
    <Dialog onOpenChange={() => form.reset()}>
      <DialogTrigger className={`${buttonVariants()} self-end`}>
        Create Project
      </DialogTrigger>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allocationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SPECIFIC">Specific</SelectItem>
                        <SelectItem value="GENERIC">Generic</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("allocationType") === "GENERIC" && (
              <>
                <FormField
                  control={form.control}
                  name="captions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Captions</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hashtags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hashtags</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
