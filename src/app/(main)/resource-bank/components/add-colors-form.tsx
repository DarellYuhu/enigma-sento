"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
import { useAddColors } from "@/hooks/feature/use-add-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const AddColorsForm = () => {
  const { mutate, isPending } = useAddColors();
  const form = useForm({
    resolver: zodResolver(
      z.object({
        file: z
          .array(
            z
              .instanceof(File)
              .refine(
                (file) =>
                  file.type ===
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              )
          )
          .min(1),
      })
    ),
    defaultValues: { file: undefined },
  });

  const handleSubmit = ({ file }: { file?: File[] }) => mutate(file![0]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Colors</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new colors</DialogTitle>
          <DialogDescription>
            Drag and drop xlsx file bellow. The file must have
            &quot;primary&quot; and &quot;secondary&quot; columns. The value
            must be a hex color.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onReset={() => form.reset()}
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Files</FormLabel>
                  <FormControl>
                    <FileUploader
                      maxSize={Infinity}
                      maxFileCount={Infinity}
                      onValueChange={field.onChange}
                      value={field.value}
                      accept={{
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                          [],
                      }}
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
                {isPending && (
                  <LoaderCircle
                    className="-ms-1 me-2 animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
