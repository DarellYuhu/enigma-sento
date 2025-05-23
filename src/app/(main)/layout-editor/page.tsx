"use client";

import dynamic from "next/dynamic";

const Canvas = dynamic(
  async () => (await import("./components/Canvas")).Canvas,
  { ssr: false }
);

export default function LayoutEditorPage() {
  return (
    <div>
      <Canvas />
    </div>
  );
}
