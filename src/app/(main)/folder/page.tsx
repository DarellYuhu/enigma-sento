"use client";

import { useQuery } from "@tanstack/react-query";
import { CreateFolderForm } from "./components/CreateFolderForm";
import { SentoClient } from "@/lib/sento-client";
import { Button } from "@/components/ui/button";
import { FolderClosed } from "lucide-react";
import Link from "next/link";

export default function FolderPage() {
  const { data } = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data } = await SentoClient.get<Folder[]>("folders");
      return data;
    },
  });
  return (
    <div className="space-y-2">
      <CreateFolderForm />
      <div className="space-x-2">
        {data?.map((folder) => (
          <Button key={folder.id} variant="outline" asChild>
            <Link href={`/folder/${folder.id}`}>
              <FolderClosed /> {folder.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
