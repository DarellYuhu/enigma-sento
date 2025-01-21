import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface BasicPageProps extends PropsWithChildren {
  content: string;
}

export const EnigmaTooltip = ({ content, children }: BasicPageProps) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="px-2 py-1 text-xs">{content}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
