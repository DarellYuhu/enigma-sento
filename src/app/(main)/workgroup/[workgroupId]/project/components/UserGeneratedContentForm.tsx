import { Button } from "@/components/ui/button";
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
  postGeneratedContentBody,
  PostGeneratedContentBody,
  usePostGeneratedContent,
} from "@/hooks/feature/use-post-generated-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Params = { storyId: string; fileLength: number };

export const UserGeneratedContentForm = (params: Params) => {
  const { mutate, isPending } = usePostGeneratedContent();
  const form = useForm<PostGeneratedContentBody>({
    resolver: zodResolver(postGeneratedContentBody(params.fileLength)),
    defaultValues: { storyId: params.storyId, files: [] },
  });

  const handleSubmit = (data: PostGeneratedContentBody) => {
    mutate(data);
  };

  useEffect(() => {
    if (params.storyId) form.reset({ storyId: params.storyId });
  }, [params.storyId, form]);

  return (
    <Form {...form}>
      <form
        className="space-y-4 col-span-full"
        onSubmit={form.handleSubmit(handleSubmit)}
        onReset={() => form.reset()}
      >
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Generated Files: {form.watch("files").length} selected
              </FormLabel>
              <FormControl>
                <FileUploader
                  maxSize={Infinity}
                  maxFileCount={Infinity}
                  multiple={true}
                  onValueChange={field.onChange}
                  value={field.value}
                  accept={{ "image/jpeg": [], "video/mp4": [] }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-x-2">
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
          <Button type="reset" variant={"outline"}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};
