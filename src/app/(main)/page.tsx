import { CreateWorkgroupDialog } from "./components/CreateWorkgroupDialog";
import { WorkgroupDatatable } from "./components/WorkgroupDatatable";

export default async function Home() {
  return (
    <div className="flex flex-col gap-4">
      <CreateWorkgroupDialog />
      <WorkgroupDatatable />
    </div>
  );
}
