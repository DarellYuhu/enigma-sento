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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCollections } from "@/hooks/feature/asset/use-collections";
import {
  createStorySchema,
  CreateStorySchema,
  useCreateStory,
} from "@/hooks/feature/project/use-create-story";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folders, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const CreateStoryForm = ({ projectId }: { projectId: string }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { mutate, isPending } = useCreateStory();
  const { data } = useCollections({ type: "IMAGE" });
  const form = useForm<CreateStorySchema>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      projectId,
      type: "SYSTEM_GENERATE",
      section: 1,
      data: [
        {
          images: [],
          texts: [],
          textColor: "#ffffff",
          textBgColor: "#000000",
          textStroke: "#000000",
          textPosition: "random",
          imageType: "Upload",
        },
      ],
    },
  });
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "data",
  });

  const handleSubmit = (data: CreateStorySchema) => {
    mutate(data, {
      onSuccess() {
        closeBtnRef.current?.click();
      },
    });
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
                  name={`data.${index}.textStroke`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stroke color</FormLabel>
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
                  name={`data.${index}.textBgColor`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background color</FormLabel>
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
                name={`data.${index}.imageType`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        className="p-2 place-self-start"
                        value={field.value}
                        onValueChange={(value) => {
                          if (value === "Upload")
                            form.setValue(`data.${index}.images`, []);
                          else {
                            form.setValue(`data.${index}.images`, "");
                          }
                          field.onChange(value);
                        }}
                      >
                        <ToggleGroupItem
                          value="Upload"
                          variant={"outline"}
                          onClick={() => field.onChange("Upload")}
                        >
                          <Upload className="h-4 w-4" /> Upload
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="Collection"
                          variant={"outline"}
                          onClick={() => field.onChange("Collection")}
                        >
                          <Folders className="h-4 w-4" /> Collection
                        </ToggleGroupItem>
                      </ToggleGroup>
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
                      {form.watch(`data.${index}.imageType`) === "Upload" ? (
                        <FileUploader
                          maxSize={Infinity}
                          maxFileCount={Infinity}
                          multiple={true}
                          onValueChange={field.onChange}
                        />
                      ) : (
                        <Select
                          value={field.value as string}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a collection" />
                          </SelectTrigger>
                          <SelectContent>
                            {data?.data
                              .filter((c) => c.assets.length > 0)
                              .map((collection) => (
                                <SelectItem
                                  value={collection._id}
                                  key={collection._id}
                                >
                                  {collection.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
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
              textPosition: "random",
              textBgColor: "#000000",
              textColor: "#ffffff",
              textStroke: "#000000",
              imageType: "Upload",
            })
          }
        >
          Add Section
        </Button>
        <DialogFooter>
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
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
  { value: "random", label: "Random" },
  { value: "bottom", label: "Bottom" },
  { value: "middle", label: "Middle" },
];
