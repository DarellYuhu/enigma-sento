import { getLayoutGroups } from "@/api/layout-group/fetch";
import { GroupList } from "./components/group-list";
import { GeneratorForm } from "./components/generator-form";

export const dynamic = "force-dynamic";

export default async function LayoutGroupPage() {
  const data = (await getLayoutGroups()).data;
  return (
    <div>
      <GroupList list={data} />
      <GeneratorForm />
    </div>
  );
}
