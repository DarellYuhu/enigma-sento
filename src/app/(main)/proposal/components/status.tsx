import { Badge } from "@/components/ui/badge";
import { StatusEnum } from "@/types/enums";

export const Status = ({ status }: { status: StatusEnum }) => {
  switch (status) {
    case StatusEnum.ACCEPTED:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          ></span>
          Accepted
        </Badge>
      );

    case StatusEnum.REJECTED:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-red-500"
            aria-hidden="true"
          ></span>
          Rejected
        </Badge>
      );

    case StatusEnum.WAITING:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-yellow-500"
            aria-hidden="true"
          ></span>
          Waiting
        </Badge>
      );

    case StatusEnum.REVISIED:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-amber-500"
            aria-hidden="true"
          ></span>
          Need Revision
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-gray-500"
            aria-hidden="true"
          ></span>
          Unkown
        </Badge>
      );
  }
};
