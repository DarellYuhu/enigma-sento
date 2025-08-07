"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCollections } from "@/hooks/feature/asset/use-collections";
import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export const GeneratorForm = () => {
  const [count, setCount] = useState("");
  const [link, setLink] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const form = useForm();
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: Record<string, string | File[]>) => {
      const res = await SentoClient.post(
        `/layout-groups/${id}/generate-contents`,
        payload,
        {
          params: { total: count || undefined, link: link || undefined },
          responseType: "blob",
        },
      );
      if (res.data.size !== 0) {
        const contentDisposition = res.headers["content-disposition"];
        const match = contentDisposition?.match(/filename="?(.+)"?/);
        const filename = match?.[1] || "downloaded-file";
        const url = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    },
    onSuccess() {
      toast.success("Content generated successfully 🎉");
    },
    onError() {
      toast.error("Something went wrong!");
    },
  });
  const { data } = useQuery({
    queryKey: ["variable-fields", id],
    queryFn: async () => {
      const { data } = await SentoClient.get<VariableField[]>(
        `layout-groups/${id}/variable-fields`,
      );
      const grouped = Object.groupBy(data, (item) => item.key);
      return grouped;
    },
    enabled: !!id,
  });

  const handleSave = () => {
    if (id) {
      const values = form.getValues();
      const filtered = Object.fromEntries(
        Object.entries(values).filter(([key]) => !key.includes("value")),
      );
      localStorage.setItem(`form-groups-${id}`, JSON.stringify(filtered));
      toast.success("Saved!");
    }
  };

  useEffect(() => {
    if (id) {
      const data = localStorage.getItem(`form-groups-${id}`);
      if (data) {
        form.reset(JSON.parse(data));
      } else form.reset();
    }
  }, [id]);

  return (
    <Dialog
      open={!!id}
      onOpenChange={(open) => !open && router.push(pathname, { scroll: false })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate from these layout?</DialogTitle>
          <DialogDescription>
            Please fill all the field bellow
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px]">
          <Input
            placeholder="Folder link"
            onChange={(e) => setLink(e.target.value)}
            className="mb-2"
          />
          <Form {...form}>
            <div className="grid grid-cols-2 items-center mb-2">
              <Label>Total Generated Content</Label>
              <Input
                value={count}
                onChange={(e) => setCount(e.target.value)}
                type="number"
                placeholder="10 by default"
              />
            </div>
            <form
              className="space-y-2"
              id="generator-form"
              onSubmit={form.handleSubmit((val) => mutate(val))}
            >
              {data &&
                Object.values(data).map((field, idx) => (
                  <div className="border p-2 rounded-md" key={idx}>
                    <p>{field?.[0].key}</p>
                    <Separator className="w-full my-2" />
                    <div className="space-y-2">
                      {field?.map((item, idx) => (
                        <FormField
                          key={idx}
                          name={item.key + item.property}
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <FormItem className="items-center space-y-0">
                                <FormLabel className="mt-0">
                                  {getLabel(item.property)}
                                </FormLabel>
                                <FormControl>
                                  {item.property === "value" ? (
                                    <Textarea
                                      rows={6}
                                      value={
                                        field.value &&
                                        (field.value as string[]).join("\n")
                                      }
                                      onChange={(e) =>
                                        field.onChange(
                                          e.currentTarget.value.split("\n"),
                                        )
                                      }
                                    />
                                  ) : (
                                    <Select
                                      onValueChange={field.onChange}
                                      value={field.value}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a value" />
                                      </SelectTrigger>
                                      <SelectContentCustom
                                        type={item.property}
                                      />
                                    </Select>
                                  )}
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button size={"sm"} variant={"outline"} onClick={handleSave}>
            <Save />
            Save
          </Button>
          <Button
            size={"sm"}
            type="submit"
            form="generator-form"
            disabled={isPending}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const getLabel = (type: VariableField["property"]) => {
  switch (type) {
    case "colorCollectionId":
      return "Color Collection";
    case "fontCollectionId":
      return "Font Collection";
    case "imageCollectionId":
      return "Image Collection";
    case "value":
      return "Text";
  }
};

const SelectContentCustom = ({ type }: { type: VariableField["property"] }) => {
  let collectionType = undefined;
  switch (type) {
    case "colorCollectionId":
      collectionType = "COLOR";
      break;
    case "fontCollectionId":
      collectionType = "FONT";
      break;
    case "imageCollectionId":
      collectionType = "IMAGE";
      break;
  }
  const { data } = useCollections({ type: collectionType as CollectionType });

  return (
    <SelectContent>
      {data?.data.map((item) => (
        <SelectItem key={item._id} value={item._id}>
          {item.name}
        </SelectItem>
      ))}
    </SelectContent>
  );
};
