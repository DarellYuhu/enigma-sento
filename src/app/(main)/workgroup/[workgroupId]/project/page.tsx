import { CreateProjectDialog } from "./components/CreateProjectDialog";
import { Projects } from "./components/Projects";

export default function ProjectPage() {
  return (
    <div className="flex flex-col gap-4">
      <CreateProjectDialog />
      <Projects />
    </div>
  );
}
