import { getLayouts } from "@/api/layout/fetch";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ItemList } from "./components/item-list";
import { GroupLayoutDialog } from "./components/group-layout-dialog";

export const dynamic = "force-dynamic";

export default async function LayoutListPage() {
  const data = (await getLayouts()).data;

  return (
    <div className="space-y-4">
      <div className="justify-between flex">
        <Link href={"/layout-editor/create-new"}>
          <Button size={"sm"}>
            <Plus />
            New
          </Button>
        </Link>
        <div>
          <GroupLayoutDialog layouts={data} />
          <Link
            className={buttonVariants({ size: "sm", className: "ml-2" })}
            href="/layout-editor/groups"
          >
            Layout Group
          </Link>
        </div>
      </div>
      <ItemList data={data} />
    </div>
  );
}
