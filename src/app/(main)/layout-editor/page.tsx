import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function LayoutListPage() {
  return (
    <div>
      <Link href={"/layout-editor/create-new"}>
        <Button size={"sm"}>
          <Plus />
          New
        </Button>
      </Link>
    </div>
  );
}
