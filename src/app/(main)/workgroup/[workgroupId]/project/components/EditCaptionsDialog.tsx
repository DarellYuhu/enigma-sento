import { badgeVariants } from "@/components/ui/badge";
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
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  updateStoryBody,
  UpdateStoryBody,
  useEditStory,
} from "@/hooks/feature/use-edit-story";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

export const EditCaptionsDialog = ({ storyId }: { storyId: string }) => {
  const cluseBtnRef = useRef<HTMLButtonElement>(null);
  const { mutate, isPending } = useEditStory();
  const form = useForm<UpdateStoryBody>({
    resolver: zodResolver(updateStoryBody),
    defaultValues: {
      storyId,
      captions: [""],
    },
  });

  const handleSubmit = (data: UpdateStoryBody) => {
    mutate(data, {
      onSuccess() {
        cluseBtnRef.current?.click();
      },
    });
  };

  useEffect(() => {
    if (storyId) {
      form.reset({
        storyId,
        captions: [""],
      });
    }
  }, [storyId, form]);

  return (
    <Dialog>
      <DialogTrigger className={badgeVariants()}>
        <Pencil size={14} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Captions?</DialogTitle>
          <DialogDescription>
            Please fill the form bellow to edit the captions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="captions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea rows={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                Update
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
      </DialogContent>
    </Dialog>
  );
};
