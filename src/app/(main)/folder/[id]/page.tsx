"use client";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useId, useRef, useState } from "react";

export default function FolderDetailPage() {
  const { id } = useParams();
  const link = typeof window !== "undefined" ? window.location.origin : "";
  return (
    <div>
      <CopyButton text={`${link}/folder/${id}`} />
    </div>
  );
}

const CopyButton = ({ text }: { text: string }) => {
  const id = useId();
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <div className="relative w-fit">
      <Input
        ref={inputRef}
        id={id}
        className="pe-9"
        type="text"
        defaultValue={text}
        readOnly
      />
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopy}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              disabled={copied}
            >
              <div
                className={cn(
                  "transition-all",
                  copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                )}
              >
                <CheckIcon
                  className="stroke-emerald-500"
                  size={16}
                  aria-hidden="true"
                />
              </div>
              <div
                className={cn(
                  "absolute transition-all",
                  copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                )}
              >
                <CopyIcon size={16} aria-hidden="true" />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            Copy to clipboard
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
