"use client";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multipleselector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAddImages } from "@/hooks/feature/asset/use-add-images";
import { usePeopleCollection } from "@/hooks/feature/asset/use-people-collection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  files: z
    .array(z.instanceof(File).refine((file) => file.type.startsWith("image/")))
    .min(1, "Required"),
  metadatas: z.array(
    z.object({
      description: z.string().trim().min(1, "Required"),
      tags: z.string().trim().min(1, "Required"),
      people: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .min(1, "Required"),
      location: z.object({
        name: z.string(),
        latitude: z.string().transform((value) => parseFloat(value)),
        longitude: z.string().transform((value) => parseFloat(value)),
      }),
    })
  ),
});
type FormSchema = z.infer<typeof formSchema>;

export const AddImageForm = () => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAddImages();
  const [option, setOption] = useState<{ label: string; value: string }[]>([]);
  const { data } = usePeopleCollection();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
      metadatas: [],
    },
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: "metadatas",
  });

  const onSubmit = ({ files, metadatas }: FormSchema) => {
    const data = metadatas.map((item) => ({
      ...item,
      location: {
        name: item.location.name,
        geoJson: {
          coordinates: [item.location.longitude, item.location.latitude],
        },
      },
      people: item.people.map((person) => person.value),
      tags: item.tags.split(/\s*,\s*|\s+/),
    }));
    mutate(
      { data, files },
      {
        onSuccess() {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  useEffect(() => {
    if (data) {
      setOption(
        data.data.map((item) => ({ label: item.name, value: item._id }))
      );
    }
  }, [data?.data]);

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
            onReset={() => form.reset()}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ScrollArea className="h-[420px]">
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
                        onValueChange={(values) => {
                          field.onChange(values);
                          form.setValue(
                            "metadatas",
                            values.map(() => ({
                              description: "",
                              location: { latitude: 0, longitude: 0, name: "" },
                              people: [],
                              tags: "",
                            }))
                          );
                        }}
                        value={field.value}
                        accept={{ "image/*": [] }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Image Metadatas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((item, idx) => (
                    <div key={item.id} className="border-b pb-4">
                      <p className="font-semibold">
                        {form.watch("files")[idx].name}
                      </p>
                      <FormField
                        control={form.control}
                        name={`metadatas.${idx}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                placeholder="Description"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`metadatas.${idx}.people`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>People</FormLabel>
                            <FormControl>
                              <MultipleSelector
                                commandProps={{
                                  label: "Select people",
                                }}
                                onChange={(v) => field.onChange(v)}
                                value={field.value}
                                options={option}
                                placeholder="Select people"
                                hideClearAllButton
                                hidePlaceholderWhenSelected
                                emptyIndicator={
                                  <p className="text-center text-sm">
                                    No results found
                                  </p>
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`metadatas.${idx}.tags`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="e.g, Flower, Rose, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Seperate with comma
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`metadatas.${idx}.location.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Location"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`metadatas.${idx}.location.longitude`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Longitude"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`metadatas.${idx}.location.latitude`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Latitude"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ScrollArea>
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
