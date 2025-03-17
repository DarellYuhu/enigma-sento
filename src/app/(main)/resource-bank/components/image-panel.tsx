"use client";

import dynamic from "next/dynamic";
import { Search } from "./search";

const ImageList = dynamic(() => import("./image-list"), { ssr: false });
const AddImageForm = dynamic(() => import("./add-image-form"), { ssr: false });

export const ImagePanel = () => {
  return (
    <div className="space-y-4">
      <AddImageForm />
      <Search />
      <ImageList />
    </div>
  );
};
