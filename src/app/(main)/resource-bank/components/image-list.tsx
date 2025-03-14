"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useImages } from "@/hooks/feature/asset/use-images";
import { format } from "date-fns";
import { Calendar, MapPin, Tags, Users } from "lucide-react";
import Image from "next/image";

const ImageList = () => {
  const { data } = useImages();

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.data.map((item, idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardHeader className="h-64 p-0 pb-4">
            <Image
              src={item.url}
              alt={item.name}
              width={1080}
              height={1080}
              className="w-full h-full object-cover"
            />
          </CardHeader>
          <CardContent>
            {/* <p className="font-semibold">{item.name}</p> */}
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
                  {item.people.map((item) => item.name).join(", ").length > 0
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
      ))}
    </div>
  );
};
export default ImageList;
