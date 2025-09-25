import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { CurveType } from "recharts/types/shape/Curve";

export const MultipleLineChart = ({
  config,
  data,
  labelKey,
  tickFormatter,
  type,
}: {
  config: ChartConfig;
  data: Record<string, string | number | object>[];
  labelKey: string;
  type: CurveType;
  tickFormatter?: (val: any) => string;
}) => {
  return (
    <ChartContainer config={config} className="w-full h-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis />
        <XAxis
          dataKey={labelKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={tickFormatter}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent labelFormatter={tickFormatter} />}
        />

        {Object.entries(config).map(([key, val], idx) => (
          <Area
            key={idx}
            dataKey={key}
            type={type}
            stroke={val.color}
            strokeWidth={2}
            dot={false}
            fillOpacity={0.05}
            fill={val.color}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
};
