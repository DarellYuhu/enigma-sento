"use client";

import {
  Dialog,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Folders } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { SentoClient } from "@/lib/sento-client";
import { AxiosError } from "axios";

const formSchema = z.object({
  people: z.string(),
});
type FormSchema = z.infer<typeof formSchema>;

export const AddPeopleForm = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      people: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { name: string }[]) => {
      const { data } = await SentoClient.post("/collections/peoples", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Peoples added!");
      setOpen(false);
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(
          err.response?.data.message || err.message || err.response?.data
        );
      toast.error("Something went wrong!");
    },
  });

  const onSubmit = (values: FormSchema) => {
    const payload = values.people
      .split(/\s*,\s*|\s+/)
      .filter(Boolean)
      .map((name) => ({ name }));
    mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Folders /> Add People Collections
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Want to create new people collection? Please fill the form below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="people"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="John Doe, Jane Doe" />
                  </FormControl>
                  <FormDescription>Seperate by comma</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
