"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCollections } from "@/hooks/feature/asset/use-collections";
import { useImages } from "@/hooks/feature/asset/use-images";
import { useUpdateCollection } from "@/hooks/feature/asset/use-update-collection";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDownIcon,
  MapPin,
  SquarePlus,
  Tags,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ImageList = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const { data } = useImages();
  const { data: collections } = useCollections({ type: "IMAGE" });
  const { mutate, isPending } = useUpdateCollection();

  const handleAddToCollection = (id: string) => {
    mutate({ id, data: { newAssets: selected } });
  };

  return (
    <div className="space-y-4">
      {selected.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="place-self-end flex">
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
      )}
      <ToggleGroup
        className="grid grid-cols-4 gap-4"
        type="multiple"
        value={selected}
        onValueChange={setSelected}
      >
        {data?.data.map((item, idx) => (
          <ToggleGroupItem
            value={item._id}
            key={item._id}
            asChild
            className="size-auto p-0"
          >
            <Card
              key={idx}
              className="overflow-hidden text-left flex-col data-[state=on]:shadow-md data-[state=on]:shadow-green-400 transition-all duration-300 cursor-pointer"
            >
              <CardHeader className="h-64 p-0 pb-4">
                <Image
                  src={item.url}
                  alt={item.name}
                  width={1080}
                  height={1080}
                  className="w-full h-full object-cover"
                />
              </CardHeader>
              <CardContent className="h-full w-full">
                <ScrollArea className="h-12">
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </ScrollArea>
                <div className="space-y-1">
                  <div className="flex flex-row gap-2 text-xs">
                    <Tags size={16} />
                    <p>{item.tags.join(", ")}</p>
                  </div>
                  <div className="flex flex-row gap-2 text-xs">
                    <Users size={16} />
                    <p>
                      {item.people.map((item) => item.name).join(", ").length >
                      0
                        ? item.people.map((item) => item.name).join(", ")
                        : "-"}
                    </p>
                  </div>
                  <div className="flex flex-row gap-2 text-xs">
                    <MapPin size={15} />
                    <p>
                      {item.location.name.length > 0 ? item.location.name : "-"}
                    </p>
                  </div>
                  <div className="flex flex-row gap-2 text-xs">
                    <Calendar size={15} />
                    <p>{format(item.updatedAt, "EEEE, MMMM do, yyyy")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
export default ImageList;
