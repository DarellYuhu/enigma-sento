import { TabsContent } from "@/components/ui/tabs";
import { CreateStoryDialog } from "./CreateStoryDialog";

export const Story = ({ value }: { value: string }) => {
  return (
    <TabsContent value={value}>
      huhi
      <CreateStoryDialog projectId={value} />
    </TabsContent>
  );
};
