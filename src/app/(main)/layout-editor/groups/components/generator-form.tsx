"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollections } from "@/hooks/feature/asset/use-collections";
import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const GeneratorForm = () => {
  const [count, setCount] = useState("");
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
          params: count && { total: count },
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );
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
    },
    onSuccess() {
      toast.success("Layout group created!");
    },
    onError() {
      toast.error("Something went wrong!");
    },
  });
  const { data } = useQuery({
    queryKey: ["variable-fields", id],
    queryFn: async () => {
      const { data } = await SentoClient.get<VariableField[]>(
        `layout-groups/${id}/variable-fields`
      );
      return data;
    },
    enabled: !!id,
  });

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
        <Form {...form}>
          <div className="grid grid-cols-2 items-center">
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
            {data?.map((item, idx) => (
              <FormField
                key={idx}
                name={item.key + item.property}
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="grid grid-cols-2 items-center space-y-0">
                      <FormLabel className="mt-0">{field.name}</FormLabel>
                      <FormControl>
                        {item.property === "value" ? (
                          <FileUploader
                            value={field.value ? [field.value] : undefined}
                            onValueChange={(val) => field.onChange(val[0])}
                            maxSize={1024 * 1024 * 10}
                            maxFileCount={1}
                            accept={{
                              "text/*": [],
                            }}
                          />
                        ) : (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a value" />
                            </SelectTrigger>
                            <SelectContentCustom type={item.property} />
                          </Select>
                        )}
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            ))}
          </form>
        </Form>
        <DialogFooter>
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
