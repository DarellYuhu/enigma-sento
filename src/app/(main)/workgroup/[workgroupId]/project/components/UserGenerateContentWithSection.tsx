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
import { SentoClient } from "@/lib/sento-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

export const AddContentWithSectionSchema = z.object({
  contentPerStory: z.number(),
  keys: z.array(z.string().nonempty()).nonempty(),
  files: z.record(z.string(), z.array(z.file())),
});
export type AddContentWithSectionDto = z.infer<
  typeof AddContentWithSectionSchema
>;

export const UserGenerateContentWithSection = ({
  storyId,
  contentPerStory,
  section,
}: {
  storyId: string;
  contentPerStory: number;
  section: number;
}) => {
  const keys = Array.from({ length: section }).map(
    (_, idx) => `section_${idx + 1}`,
  );
  const form = useForm<AddContentWithSectionDto>({
    resolver: zodResolver(AddContentWithSectionSchema),
    defaultValues: {
      contentPerStory,
      keys,
      files: keys.reduce<Record<string, File[]>>((acc, _, i) => {
        acc[`section_${i + 1}`] = [];
        return acc;
      }, {}),
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: AddContentWithSectionDto) => {
      await SentoClient.post(
        `/stories/${storyId}/generated-content-with-seciton`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
    },
    onSuccess() {
      toast.success("File uploaded successfully 🎉");
    },
    onError(error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data?.message);
      toast.error("Something went wrong");
    },
  });
  return (
    <div className="col-span-full space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((val) => mutate(val))}
          id={`post-with-section-${storyId}`}
        >
          <div className="grid grid-cols-3 w-full gap-4">
            {Object.keys(form.watch("files")).map((key) => (
              <FormField
                key={`files.${key}`}
                name={`files.${key}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Generated Files: {form.watch(`files.${key}`).length}{" "}
                      selected
                    </FormLabel>
                    <FormControl>
                      <FileUploader
                        maxSize={8 * 1024 * 1024}
                        maxFileCount={contentPerStory}
                        multiple={true}
                        onValueChange={field.onChange}
                        value={field.value}
                        accept={{
                          "image/jpeg": [],
                          "image/png": [],
                          "video/mp4": [],
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </form>
      </Form>
      <Button
        type="submit"
        form={`post-with-section-${storyId}`}
        disabled={isPending}
      >
        Submit
      </Button>
    </div>
  );
};
