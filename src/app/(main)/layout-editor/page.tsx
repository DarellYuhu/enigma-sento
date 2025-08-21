"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ItemList } from "./components/item-list";
import { Search } from "@/components/ui/search";
import { GroupLayoutDialog } from "./components/group-layout-dialog";

export default function LayoutListPage() {
  return (
    <div className="space-y-4">
      <div className="justify-between flex">
        <Link href={"/layout-editor/create-new"}>
          <Button size={"sm"}>
            <Plus />
            New
          </Button>
        </Link>
        <div className="flex flex-row items-center gap-2">
          <Search />
          <GroupLayoutDialog />
          <Link
            className={buttonVariants({ size: "sm" })}
            href="/layout-editor/groups"
          >
            Layout Group
          </Link>
        </div>
      </div>
      <ItemList />
    </div>
  );
}
