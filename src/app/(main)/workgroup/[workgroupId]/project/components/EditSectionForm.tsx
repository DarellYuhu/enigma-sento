import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { StoryData } from "@/hooks/feature/use-projects";
import {
  updateSectionSchema,
  UpdateSectionSchema,
  useUpdateSection,
} from "@/hooks/feature/use-update-section";
import { getDirtyFields } from "@/utils/getDirtyFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceBy } from "lodash";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type Params = { data: StoryData; sectionId: string; storyId: string };
export const EditSectionForm = ({ data, sectionId, storyId }: Params) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { mutate } = useUpdateSection();
  const form = useForm<UpdateSectionSchema>({
    resolver: zodResolver(updateSectionSchema),
  });
  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const initialData = useMemo(() => {
    const { texts, ...rest } = data;
    return { ...rest, texts: texts.join("\n"), newImages: [] };
  }, [data]);

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: UpdateSectionSchema) => {
    const dirty = getDirtyFields(initialData, data);
    const deletedImages = dirty.image
      ? differenceBy(initialData.images, data.images, "_id")
      : undefined;
    mutate(
      { ...dirty, sectionId, storyId, deletedImages },
      {
        onSuccess() {
          closeRef.current?.click();
        },
      }
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Pencil />
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent
        className="overflow-y-scroll"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Edit Section</SheetTitle>
          <SheetDescription>
            Make changes to your section here. Click save when you&lsquo;re
            done. Only changes will be saved.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            onReset={() => form.reset()}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`textColor`}
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
                name={`textStroke`}
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
                name={`textBgColor`}
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
                name={`textPosition`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
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
              name={`texts`}
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
            <div>
              <Label>Current Images</Label>
              <ScrollArea>
                <div className="grid grid-cols-2 gap-4">
                  {fields.map(({ url, name }, idx) => (
                    <div className="relative rounded-md border-2" key={idx}>
                      <Image
                        src={url}
                        width={1080}
                        height={1080}
                        alt={name}
                        className="object-cover w-full h-full"
                      />
                      <Button
                        onClick={() => remove(idx)}
                        type="button"
                        className="absolute top-4 right-4 size-8"
                        size={"icon"}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <FormField
              control={form.control}
              name={`newImages`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Images</FormLabel>
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
            <SheetFooter>
              <Button type="reset" variant={"outline"}>
                Reset
              </Button>
              <Button type="submit">Save changes</Button>
              <SheetClose hidden ref={closeRef}>
                Close
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

const options = [
  { value: "random", label: "Random" },
  { value: "bottom", label: "Bottom" },
  { value: "middle", label: "Middle" },
];
