"use client";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import "@excalidraw/excalidraw/index.css";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

export default function LayoutEditorPage() {
  return (
    <div className="space-y-5">
      <p className="text-2xl font-bold">Under development</p>

      <Card>
        <CardHeader>
          <CardTitle>Tldraw</CardTitle>
        </CardHeader>
        <CardContent className="h-[600px]">
          <Tldraw />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Excalidraw</CardTitle>
        </CardHeader>
        <CardContent className="h-[600px]">
          <Excalidraw />
        </CardContent>
      </Card>
    </div>
  );
}
