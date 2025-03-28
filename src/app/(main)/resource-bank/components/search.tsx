import { Input } from "@/components/ui/input";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Search = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const searchParams = new URLSearchParams(window.location.search);

  const handleSearch = () => {
    if (value !== "") {
      searchParams.set("search", encodeURIComponent(value));
    } else {
      searchParams.delete("search");
    }
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <div className="relative">
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
  );
};
