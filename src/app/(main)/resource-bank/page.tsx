import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALargeSmall, Cog, LucideIcon, Music, Palette } from "lucide-react";
import { MusicPanel } from "./components/music-panel";
import { FontPanel } from "./components/font-panel";
import { ColorPanel } from "./components/color-panel";
import { RepurposePanel } from "./components/repurpose-panel";
import { CreateCollectionForm } from "./components/create-collection-form";

export default function ResourceBankPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-end">
        <CreateCollectionForm />
      </div>
      <div className="relative">
        <Tabs defaultValue="music">
          <ScrollArea>
            <TabsList className="relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
              {tabMenu.map((item) => (
                <Trigger key={item.value} {...item} />
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent value="music">
            <MusicPanel />
          </TabsContent>
          <TabsContent value="font">
            <FontPanel />
          </TabsContent>
          <TabsContent value="color">
            <ColorPanel />
          </TabsContent>
          <TabsContent value="repurpose" className="h-full">
            <RepurposePanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

type Props = {
  label: string;
  value: string;
  icon: LucideIcon;
};
const Trigger = ({ value, label, ...props }: Props) => {
  return (
    <TabsTrigger
      value={value}
      className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
    >
      <props.icon
        className="-ms-0.5 me-1.5 opacity-60"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
      {label}
    </TabsTrigger>
  );
};

const tabMenu: Props[] = [
  {
    icon: Music,
    label: "Music",
    value: "music",
  },
  {
    icon: ALargeSmall,
    label: "Font",
    value: "font",
  },
  {
    icon: Palette,
    label: "Color",
    value: "color",
  },
  {
    icon: Cog,
    label: "Repurpose",
    value: "repurpose",
  },
];
