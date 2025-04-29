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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "@/hooks/feature/project/use-create-project";
import { useProposals } from "@/hooks/feature/proposal/use-proposals";
import { useWorkgroup } from "@/hooks/feature/workgroup/use-workgroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
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
    proposalId: z.string().optional(),
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
  const { data: workgroup } = useWorkgroup();
  const { data: proposals } = useProposals();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      allocationType: "GENERIC",
      captions: undefined,
      hashtags: undefined,
    },
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
          {workgroup?.data.withTicket && (
            <div className="rounded-md border px-4 py-3">
              <p className="text-sm">
                <InfoIcon
                  className="me-3 -mt-0.5 inline-flex text-blue-500"
                  size={16}
                  aria-hidden="true"
                />
                This workgroup need a ticket! please select the proposal
              </p>
            </div>
          )}
          <Form {...form}>
            <ScrollArea className="h-[420px]">
              {workgroup?.data.withTicket && (
                <FormField
                  control={form.control}
                  name="proposalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a proposal" />
                          </SelectTrigger>
                          <SelectContent>
                            {proposals?.data.map((proposal) => (
                              <SelectItem key={proposal.id} value={proposal.id}>
                                {proposal.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val === "SPECIFIC") {
                            form.setValue("captions", undefined);
                            form.setValue("hashtags", undefined);
                          }
                        }}
                      >
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
            </ScrollArea>
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
