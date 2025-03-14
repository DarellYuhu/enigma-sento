"use client";

import dynamic from "next/dynamic";
import { AddImageForm } from "./add-image-form";
import { Search } from "./search";

const ImageList = dynamic(() => import("./image-list"), { ssr: false });

export const ImagePanel = () => {
  return (
    <div className="space-y-4">
      <AddImageForm />
      <Search />
      <ImageList />
    </div>
  );
};
