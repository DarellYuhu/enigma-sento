import { CreateWorkgroupDialog } from "./components/CreateWorkgroupDialog";
import { SignOut } from "./components/SignOut";
import { WorkgroupDatatable } from "./components/WorkgroupDatatable";

export default async function Home() {
  return (
    <div>
      <SignOut />
      <CreateWorkgroupDialog />
      <WorkgroupDatatable />
    </div>
  );
}
