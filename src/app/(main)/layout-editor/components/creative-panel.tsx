import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Font } from "@/hooks/feature/asset/use-fonts";
import { useLoadFonts } from "../utils/use-load-fonts";
import { useQuery } from "@tanstack/react-query";
import { SentoClient } from "@/lib/sento-client";

export const CreativePanel = ({ value }: { value: Layout }) => {
  const fontId = value.template.shapes
    .map((shape) => shape.fontId)
    .filter(Boolean);
  const { data: fonts } = useQuery({
    queryKey: ["fonts", { fontId }],
    queryFn: async () => {
      const { data } = await SentoClient<{ data: Font[] }>("/assets/fonts", {
        params: { fontId },
      });
      return data;
    },
    enabled: !!fontId && fontId.length > 0,
  });

  useLoadFonts(fonts?.data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creative</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ========= FONT SELECTION ========= */}
        <p className="text-2xl font-bold">Under development</p>
      </CardContent>
    </Card>
  );
};
