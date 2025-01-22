import { CreateProjectDialog } from "./components/CreateProjectDialog";
import { Projects } from "./components/Projects";

export default function ProjectPage() {
  return (
    <div>
      <CreateProjectDialog />
      <Projects />
    </div>
  );
}
