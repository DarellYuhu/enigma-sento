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
import {
  addFontSchema,
  AddFontSchema,
  useAddFonts,
} from "@/hooks/feature/asset/use-add-fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

export const AddFontsForm = () => {
  const { mutate, isPending } = useAddFonts();
  const form = useForm<AddFontSchema>({
    resolver: zodResolver(addFontSchema),
    defaultValues: {
      files: [],
    },
  });

  const handleSubmit = (data: AddFontSchema) => {
    mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Fonts</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new fonts</DialogTitle>
          <DialogDescription>
            Drag and drop your fonts below. The font should be in a .ttf or .otf
            format
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
                      accept={{
                        "font/ttf": [],
                        "font/otf": [],
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
