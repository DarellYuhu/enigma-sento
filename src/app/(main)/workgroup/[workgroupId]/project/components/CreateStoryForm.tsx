import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
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
import {
  createStorySchema,
  CreateStorySchema,
  useCreateStory,
} from "@/hooks/feature/use-create-story";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const CreateStoryForm = ({ projectId }: { projectId: string }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { mutateAsync } = useCreateStory();
  const form = useForm<CreateStorySchema>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      projectId,
      type: "SYSTEM_GENERATE",
      section: 1,
      data: [
        { images: [], texts: [], textColor: "", textPosition: "top-left" },
      ],
    },
  });
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "data",
  });

  const handleSubmit = (data: CreateStorySchema) => {
    const modified = {
      ...data,
      data: data.data?.map((item, idx) => ({
        ...item,
        images: item.images.map(
          (image) => new File([image], `${idx}_${image.name}`)
        ),
      })),
    };
    mutateAsync(modified).then(() => closeBtnRef.current?.click());
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of sections</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between ">
              <CardTitle>Section {index + 1}</CardTitle>
              <Button
                variant={"destructive"}
                size={"icon"}
                type="submit"
                onClick={() => remove(index)}
              >
                <Trash2 size={10} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`data.${index}.textColor`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text color</FormLabel>
                      <FormControl>
                        <ColorPicker
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`data.${index}.textPosition`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text position</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select text position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options.map((option) => (
                            <SelectItem value={option.value} key={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`data.${index}.texts`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texts</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`data.${index}.images`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        maxSize={Infinity}
                        maxFileCount={Infinity}
                        multiple={true}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}
        <Button
          type="button"
          onClick={() =>
            append({
              images: [],
              texts: [],
              textColor: "",
              textPosition: "top-left",
            })
          }
        >
          Add Section
        </Button>
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
    </Form>
  );
};

const options = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "middle-left", label: "Middle Left" },
  { value: "middle-center", label: "Middle Center" },
  { value: "middle-right", label: "Middle Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
];
