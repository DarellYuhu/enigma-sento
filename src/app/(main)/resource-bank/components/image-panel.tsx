"use client";

import dynamic from "next/dynamic";
import { Search } from "./search";
import { CollectionList } from "./collection-list";

const ImageList = dynamic(() => import("./image-list"), { ssr: false });
const AddImageForm = dynamic(() => import("./add-image-form"), { ssr: false });

export const ImagePanel = () => {
  return (
    <div className="space-y-4">
      <CollectionList type="IMAGE" />
      <AddImageForm />
      <Search />
      <ImageList />
    </div>
  );
};
