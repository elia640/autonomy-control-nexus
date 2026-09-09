import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SeriesCheckbox } from "@/components/GLOBAL/SeriesCheckbox";
import type { ThroughputSample } from "@/types/network";
import { ChartCanvas, ChartLegend, ChartRoot, chartAxisStyles } from "./ThroughputChart.styles";

type SeriesKey = "upload" | "download" | "bandwidth";

export interface ThroughputChartProps {
  samples: ThroughputSample[];
  /** Draws the dashed maximum-bandwidth reference line, in Mbps. */
  maxBandwidth: number;
}

export function ThroughputChart({ samples, maxBandwidth }: ThroughputChartProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    upload: true,
    download: true,
    bandwidth: true,
  });

  const series: { key: SeriesKey; label: string; color: string }[] = [
    { key: "upload", label: "Upload", color: theme.palette.status.good },
    { key: "download", label: "Download", color: theme.palette.status.marginal },
    { key: "bandwidth", label: "Bandwidth", color: theme.palette.primary.main },
  ];

  const axis = chartAxisStyles(theme.palette.divider, theme.palette.text.secondary);

  return (
    <ChartRoot>
      <ChartCanvas>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={samples} margin={{ top: 6, right: 8, bottom: 14, left: -8 }}>
            <CartesianGrid stroke={theme.palette.divider} strokeDasharray="2 3" />
            <XAxis
              dataKey="t"
              type="number"
              domain={[0, 60]}
              ticks={[0, 10, 20, 30, 40, 50, 60]}
              tick={axis.tick}
              tickLine={axis.line}
              axisLine={axis.line}
              label={{ value: "Seconds", position: "insideBottom", offset: -10, ...axis.label }}
            />
            <YAxis
              domain={[0, 25]}
              ticks={[0, 5, 10, 15, 20, 25]}
              tick={axis.tick}
              tickLine={axis.line}
              axisLine={axis.line}
              label={{
                value: "Mbps",
                angle: -90,
                position: "insideLeft",
                offset: 16,
                ...axis.label,
              }}
            />
            <Tooltip
              contentStyle={{
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                fontSize: 10,
              }}
            />
            <ReferenceLine
              y={maxBandwidth}
              stroke={theme.palette.primary.main}
              strokeDasharray="5 4"
              strokeWidth={1.4}
              ifOverflow="extendDomain"
              label={{
                value: "MAX BW",
                position: "insideTopRight",
                fontSize: 8,
                fill: theme.palette.primary.main,
              }}
            />
            {series
              .filter((s) => visible[s.key])
              .map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  isAnimationActive={false}
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  dot={false}
                  strokeWidth={1.6}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCanvas>

      <ChartLegend>
        {series.map((s) => (
          <SeriesCheckbox
            key={s.key}
            label={s.label}
            color={s.color}
            checked={visible[s.key]}
            onChange={(checked) => setVisible((prev) => ({ ...prev, [s.key]: checked }))}
          />
        ))}
      </ChartLegend>
    </ChartRoot>
  );
}
