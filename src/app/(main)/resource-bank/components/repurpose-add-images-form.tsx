import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddRepurposeImages } from "@/hooks/feature/asset/use-add-repurpose-images";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  files: z.array(z.instanceof(File)),
});

export const RepurposeAddImagesForm = () => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAddRepurposeImages();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${buttonVariants()}`}>
        Add Images
      </DialogTrigger>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>Want to add new images?</DialogTitle>
          <DialogDescription>
            Click or drag and drop your images below
          </DialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onReset={() => form.reset()}
            onSubmit={form.handleSubmit((data) =>
              mutate(data, {
                onSuccess() {
                  form.reset();
                  setOpen(false);
                },
              })
            )}
          >
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Files</FormLabel>
                  <FormControl>
                    <FileUploader
                      maxSize={Infinity}
                      maxFileCount={Infinity}
                      multiple={true}
                      onValueChange={field.onChange}
                      value={field.value}
                      accept={{ "image/*": [] }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-x-2 place-self-end">
              <Button type="reset" variant={"outline"}>
                Reset
              </Button>
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
