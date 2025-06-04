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
import { useSelectionStore } from "./item-list";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { SentoClient } from "@/lib/sento-client";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
  layoutIds: z.array(z.number()).min(1, "Required"),
});
type FromSchema = z.infer<typeof formSchema>;

export const GroupLayoutDialog = ({ layouts }: { layouts: Layout[] }) => {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const selected = useSelectionStore((state) => state.selected);
  const form = useForm<FromSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      layoutIds: [],
      name: "",
      description: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: FromSchema) => {
      const { data } = await SentoClient.post("/layout-groups", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Layout group created!");
      closeRef.current?.click();
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  useEffect(() => {
    if (selected.length > 0 && open) {
      form.setValue("layoutIds", selected);
    }
  }, [selected, open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger
        className={buttonVariants({ size: "sm" })}
        disabled={!selected.length}
      >
        Create Layout Group
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Layout Group?</DialogTitle>
          <DialogDescription>
            Create a new layout group with the selected layouts. Also, please
            fill this form bellow
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-2"
            id="create-layout-form"
            onSubmit={form.handleSubmit((data) => mutate(data))}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Group Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      {...field}
                      placeholder="Group Description"
                    />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="layoutIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Layouts</FormLabel>
                  {field.value.map((id) => {
                    const item = layouts.find((layout) => layout.id === id);
                    return (
                      <div
                        className="group border p-2 rounded-md shadow-md relative flex gap-2"
                        key={id}
                      >
                        <div>
                          <p className="font-semibold text-base">
                            {item?.name}
                          </p>
                          <p className="text-xs">{item?.creator.displayName}</p>
                        </div>
                      </div>
                    );
                  })}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose
            className={buttonVariants({ variant: "outline" })}
            ref={closeRef}
          >
            Cancel
          </DialogClose>
          <Button disabled={isPending} type="submit" form="create-layout-form">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
