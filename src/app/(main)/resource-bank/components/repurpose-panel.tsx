import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const RepurposePanel = () => {
  return (
    <Tabs
      defaultValue="tab-1"
      orientation="vertical"
      className="flex w-full gap-2"
    >
      <TabsList className="flex-col rounded-none border-l border-border bg-transparent p-0 h-full">
        {tabMenu.map((item, idx) => (
          <TabsTrigger
            key={idx}
            value={item.value}
            className="relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="grow rounded-lg border border-border text-start">
        <TabsContent value="tab-1">
          <p className="px-4 py-1.5 text-xs text-muted-foreground">
            Under Construction
          </p>
        </TabsContent>
        <TabsContent value="tab-2">
          <p className="px-4 py-1.5 text-xs text-muted-foreground">
            Under Construction
          </p>
        </TabsContent>
        <TabsContent value="tab-3">
          <p className="px-4 py-1.5 text-xs text-muted-foreground">
            Under Construction
          </p>
        </TabsContent>
      </div>
    </Tabs>
  );
};

const tabMenu = [
  {
    label: "Images",
    value: "tab-1",
  },
  {
    label: "Videos",
    value: "tab-2",
  },
  {
    label: "Banners",
    value: "tab-3",
  },
];
