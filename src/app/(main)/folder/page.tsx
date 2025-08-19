"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateFolderForm } from "./components/CreateFolderForm";
import { SentoClient } from "@/lib/sento-client";
import {
  Cog,
  EllipsisVertical,
  FolderClosed,
  PackageCheck,
  Trash,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function FolderPage() {
  const { data } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data } = await SentoClient.get<Folder[]>("folders");
      return data;
    },
  });
  const { mutate: handleDelete } = useMutation({
    mutationFn: async (id: string) => {
      await SentoClient.delete(`/folders/${id}`);
    },
    onSuccess() {
      toast.success("Folder deleted successfully 🎉");
    },
    onError(error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data?.message);
      toast.error("Something went wrong!");
    },
  });
  return (
    <div className="space-y-4">
      <CreateFolderForm />
      <div className="grid grid-cols-2 gap-2">
        {data?.map((folder) => (
          <div
            key={folder.id}
            className="border rounded-md p-2 flex flex-row gap-2 items-center"
          >
            <FolderClosed size={18} /> <p>{folder.name}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full shadow-none ml-auto"
                  aria-label="Open edit menu"
                >
                  <EllipsisVertical size={16} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href={`/folder/${folder.id}`}>
                  <DropdownMenuItem>
                    <Cog /> Bundle config
                  </DropdownMenuItem>
                </Link>
                <Link href={`/folder/${folder.id}/groups`}>
                  <DropdownMenuItem>
                    <PackageCheck /> Distributed contents
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-600"
                  onClick={() => handleDelete(folder.id)}
                >
                  <Trash /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}
