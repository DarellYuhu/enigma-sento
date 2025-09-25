"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkgroupDialog } from "./components/CreateWorkgroupDialog";
import { WorkgroupDatatable } from "./components/WorkgroupDatatable";
import { MultipleLineChart } from "@/components/enigma/multiple-line-chart";
import { useQuery } from "@tanstack/react-query";
import { SentoClient } from "@/lib/sento-client";
import { isDate } from "lodash";
import { format } from "date-fns";
import DateRangePicker from "@/components/enigma/date-range-picker";
import { parseAsIsoDate, useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [since, setSince] = useQueryState("since", parseAsIsoDate);
  const [until, setUntil] = useQueryState("until", parseAsIsoDate);
  const [unit, setUnit] = useQueryState("unit");
  const { data: statistics } = useQuery({
    queryKey: ["statistics", { since, until, unit }],
    async queryFn() {
      const { data } = await SentoClient.get<
        {
          _id: { date: string };
          totalStory: number;
          totalContent: number;
        }[]
      >("/statistics/overall", { params: { since, until, unit } });
      return data;
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>
              Overall content production over time
            </CardDescription>
          </div>
          <div className="flex flex-row gap-2">
            <Select onValueChange={setUnit} defaultValue="week">
              <SelectTrigger>
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker
              selected={{
                from: since ? new Date(since) : undefined,
                to: until ? new Date(until) : undefined,
              }}
              onSelect={(val) => {
                if (val.from) setSince(val.from);
                if (val.to) setUntil(val.to);
              }}
            />
            <Button
              variant={"outline"}
              onClick={() => {
                setSince(null);
                setUntil(null);
                setUnit(null);
              }}
            >
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          {statistics && (
            <MultipleLineChart
              labelKey="_id.date"
              data={statistics}
              type={"linear"}
              tickFormatter={(val) => {
                return isDate(new Date(val))
                  ? format(new Date(val), "dd MMM yyyy")
                  : "";
              }}
              config={{
                totalStory: { label: "Total Story", color: "var(--chart-1)" },
                totalContent: { label: "Total Content", color: "black" },
              }}
            />
          )}
        </CardContent>
      </Card>
      <CreateWorkgroupDialog />
      <WorkgroupDatatable />
    </div>
  );
}
