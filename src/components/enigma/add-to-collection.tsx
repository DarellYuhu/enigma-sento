import { Button } from "@/components/ui/button";
import { ChevronDownIcon, SquarePlus } from "lucide-react";
import { useCollections } from "@/hooks/feature/asset/use-collections";
import { useUpdateCollection } from "@/hooks/feature/asset/use-update-collection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AddToCollection = ({
  selected,
  type,
}: {
  selected: string[];
  type: CollectionType;
}) => {
  const { data: collections } = useCollections({ type });
  const { mutate, isPending } = useUpdateCollection();

  const handleAddToCollection = (id: string) => {
    mutate({ id, data: { newAssets: selected } });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="place-self-end flex"
        disabled={selected.length < 1}
      >
        <Button variant="outline">
          <SquarePlus /> Add to collection
          <ChevronDownIcon
            className="-me-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {collections?.data.map((item) => (
          <DropdownMenuItem
            key={item._id}
            onClick={() => handleAddToCollection(item._id)}
            disabled={isPending}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
