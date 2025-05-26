"use client";

import VanillaCanvas from "./components/VanillaCanvas";

// import dynamic from "next/dynamic";

// const Canvas = dynamic(
//   async () => (await import("./components/Canvas")).Canvas,
//   { ssr: false }
// );

export default function LayoutEditorPage() {
  return (
    <div>
      <VanillaCanvas />
    </div>
  );
}
