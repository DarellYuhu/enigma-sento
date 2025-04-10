import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowRightIcon, SearchIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiVectorThree } from "react-icons/pi";
import { LuTextSearch } from "react-icons/lu";

export const Search = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [searchType, setSearchType] = useState("semantic");
  const searchParams = new URLSearchParams(window.location.search);

  const handleSearch = () => {
    if (value !== "") {
      searchParams.set("search", value);
    } else {
      searchParams.delete("search");
    }

    if (searchType) {
      searchParams.set("searchType", searchType);
    } else {
      searchParams.delete("searchType");
    }
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-row gap-2">
      <div className="relative w-full">
        <Input
          className="peer ps-9 pe-9"
          placeholder="Search..."
          type="search"
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="button"
          onClick={handleSearch}
        >
          <ArrowRightIcon size={16} aria-hidden="true" />
        </button>
      </div>
      {/* <TooltipProvider> */}
      <ToggleGroup
        type="single"
        variant="outline"
        value={searchType}
        onValueChange={(value) => {
          if (value) setSearchType(value);
        }}
        className="w-full"
      >
        <ToggleGroupItem className="flex-1 text-nowrap" value="semantic">
          <PiVectorThree /> Semantic search
        </ToggleGroupItem>
        <ToggleGroupItem className="flex-1 text-nowrap" value="full-text">
          <LuTextSearch /> Text search
        </ToggleGroupItem>
        <ToggleGroupItem className="flex-1 text-nowrap" value="people">
          <User /> People search
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
