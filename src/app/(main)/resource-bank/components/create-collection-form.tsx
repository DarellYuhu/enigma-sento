"use client";

import {
  Dialog,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  collectionFormSchema,
  CollectionFormSchema,
  useCreateCollection,
} from "@/hooks/feature/asset/use-create-collection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folders } from "lucide-react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { MusicList } from "./music-list";
import { ColorList } from "./color-list";
import { FontList } from "./font-list";
import { RepurposeBannerList } from "./repurpose-banner-list";
import { RepurposeImageList } from "./repurpose-image-list";
import { RepurposeVideoList } from "./repurpose-video-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export const CreateCollectionForm = () => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateCollection();
  const form = useForm<CollectionFormSchema>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: "",
      type: "MUSIC",
      assets: [],
    },
  });

  const onSubmit = (values: CollectionFormSchema) => {
    mutate(values, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Folders /> New Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Want to create new collection? Please fill the form below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[420px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Collection Name" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {selectOptions.map((item) => (
                              <SelectItem value={item.value} key={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assets"
                render={() => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <FormProvider {...form}>
                        <AssetList />
                      </FormProvider>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const AssetList = () => {
  const form = useFormContext<CollectionFormSchema>();

  switch (form.watch("type")) {
    case "MUSIC":
      return (
        <MusicList
          onRowSelect={(values) =>
            form.setValue(
              "assets",
              values.map((value) => value._id)
            )
          }
        />
      );
    case "COLOR":
      return (
        <ColorList
          onColorSelect={(values) => form.setValue("assets", values)}
        />
      );
    case "FONT":
      return (
        <FontList
          onRowSelect={(values) =>
            form.setValue(
              "assets",
              values.map((value) => value._id)
            )
          }
        />
      );
    case "REP-BANNER":
      return (
        <RepurposeBannerList
          onBannerSelect={(values) => form.setValue("assets", values)}
        />
      );
    case "REP-IMAGE":
      return (
        <RepurposeImageList
          onImageSelect={(values) => form.setValue("assets", values)}
        />
      );
    case "REP-VIDEO":
      return (
        <RepurposeVideoList
          onVideSelect={(values) => form.setValue("assets", values)}
          toggleSelectArea
        />
      );
    default:
      return <div>Select type first or add after creating</div>;
  }
};
const selectOptions: { label: string; value: CollectionType }[] = [
  { label: "Music", value: "MUSIC" },
  { label: "Color", value: "COLOR" },
  { label: "Font", value: "FONT" },
  { label: "Repurposed Image", value: "REP-IMAGE" },
  { label: "Repurposed Video", value: "REP-VIDEO" },
  { label: "Repurposed Banner", value: "REP-BANNER" },
];
