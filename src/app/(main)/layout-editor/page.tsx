import { getLayouts } from "@/api/layout/fetch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function LayoutListPage() {
  const data = (await getLayouts()).data;

  return (
    <div className="space-y-4">
      <Link href={"/layout-editor/create-new"}>
        <Button size={"sm"}>
          <Plus />
          New
        </Button>
      </Link>
      <div className="flex flex-row flex-wrap">
        {data.map((item) => (
          <Link href={`/layout-editor/${item.id}`} key={item.id}>
            <div className="border p-2 rounded-md shadow-md">
              <p className="font-semibold text-lg">{item.name}</p>
              <p className="text-sm">by: {item.creator.displayName}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
