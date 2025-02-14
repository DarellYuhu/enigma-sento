import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoryData } from "@/hooks/feature/use-projects";
import Image from "next/image";
import { EditSectionForm } from "./EditSectionForm";

export const SectionCard = ({
  item,
  storyId,
}: {
  item: StoryData;
  storyId: string;
}) => {
  return (
    <div className="p-4 space-y-2 border-2 shadow-md rounded-md grid grid-cols-3">
      <Carousel className="col-span-full">
        <CarouselContent>
          {item.images.map((image, idx) => (
            <CarouselItem key={idx}>
              <Image
                className="size-44 object-cover w-full rounded-md border-2"
                src={image.url}
                alt="story_img"
                width={1080}
                height={1080}
                key={idx}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>
      <div className="col-span-full">
        <p className="font-semibold">Text Position</p>
        <p>{item.textPosition}</p>
      </div>

      <div>
        <p className="font-semibold">Text</p>
        <Badge
          style={{
            height: "20px",
            backgroundColor: item.textColor,
          }}
        />
      </div>
      <div>
        <p className="font-semibold">Bg</p>
        <Badge
          style={{
            height: "20px",
            backgroundColor: item.textBgColor ?? "white",
          }}
        />
      </div>
      <div>
        <p className="font-semibold">Stroke</p>
        <Badge
          style={{
            height: "20px",
            backgroundColor: item.textStroke ?? "white",
          }}
        />
      </div>
      <div className="col-span-full">
        <p className="font-semibold">Text Overlay</p>
        <ScrollArea className="h-[200px] mt-0">
          {item.texts.map((text, idx) => (
            <p
              key={idx}
              style={{
                color: "black",
              }}
            >
              {text}
            </p>
          ))}
        </ScrollArea>
        <div className="col-span-full place-self-end">
          <EditSectionForm data={item} storyId={storyId} sectionId={item._id} />
        </div>
      </div>
    </div>
  );
};
