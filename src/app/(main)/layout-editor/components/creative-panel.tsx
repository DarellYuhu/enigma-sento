import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFonts } from "@/hooks/feature/asset/use-fonts";

export const CreativePanel = () => {
  const { data: fonts } = useFonts();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Creative</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ========= FONT SELECTION ========= */}
        <div className="space-y-2">
          <p className="font-semibold text-sm text-muted-foreground">Font</p>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {fonts?.data.map((font) => (
                <SelectItem key={font._id} value={font._id}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
