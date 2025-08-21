"use client";
import { GroupList } from "./components/group-list";
import { GeneratorForm } from "./components/generator-form";
import { Search } from "@/components/ui/search";

export default function LayoutGroupPage() {
  return (
    <div className="space-y-2">
      <Search />
      <GroupList />
      <GeneratorForm />
    </div>
  );
}
