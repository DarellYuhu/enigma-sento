import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGenerateContent } from "@/hooks/feature/use-generate-content";
import { useId, useState } from "react";

export const GenerateContentButton = ({ storyId }: { storyId: string }) => {
  const id = useId();
  const [checked, setChecked] = useState(false);
  const { mutate, isPending } = useGenerateContent();

  return (
    <div className="flex flex-row gap-2 justify-between">
      <Button
        disabled={isPending}
        onClick={() => mutate({ storyId, withMusic: checked })}
      >
        Generate
      </Button>
      <div className="space-x-4">
        <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={setChecked}
            className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
          />
          <span className="min-w-78flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full">
            <span className="text-[10px] font-medium uppercase">No</span>
          </span>
          <span className="min-w-78flex pointer-events-none relative me-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=unchecked]:invisible peer-data-[state=checked]:-translate-x-full peer-data-[state=checked]:text-background rtl:peer-data-[state=checked]:translate-x-full">
            <span className="text-[10px] font-medium uppercase">Yes</span>
          </span>
        </div>
        <Label htmlFor={id}>Generate video?</Label>
      </div>
    </div>
  );
};
