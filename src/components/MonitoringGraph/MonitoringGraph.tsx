import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SeriesCheckbox } from "@/components/GLOBAL/SeriesCheckbox";
import type { ThroughputSample } from "@/types/network";
import { ChartCanvas, ChartLegend, ChartRoot, chartAxisStyles } from "./MonitoringGraph.styles";

type SeriesKey = "upload" | "download" | "latency" | "bandwidth";

export interface MonitoringGraphProps {
  samples: ThroughputSample[];
  /** Dashed maximum-bandwidth reference, in Mbps (kept for API compatibility). */
  maxBandwidth?: number;
  /** Adds the latency series and its right-hand axis (vehicle modems). */
  withLatency?: boolean;
}

export function MonitoringGraph({ samples, withLatency }: MonitoringGraphProps) {
  const theme = useTheme();
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    upload: true,
    download: true,
    latency: true,
    bandwidth: true,
  });

  const series: { key: SeriesKey; label: string; color: string; dashed?: boolean }[] = [
    { key: "upload", label: "Upload", color: theme.palette.success.main },
    { key: "download", label: "Download", color: theme.palette.status.marginal },
    ...(withLatency
      ? [{ key: "latency" as const, label: "Latency", color: theme.palette.secondary.main }]
      : []),
    { key: "bandwidth", label: "Bandwidth", color: theme.palette.primary.main, dashed: true },
  ];

  const axis = chartAxisStyles(theme);

  return (
    <ChartRoot>
      <ChartCanvas>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={samples} margin={{ top: 6, right: withLatency ? 4 : 8, bottom: 14, left: -8 }}>
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
              yAxisId="mbps"
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
            {withLatency && (
              <YAxis
                yAxisId="ms"
                orientation="right"
                domain={[0, 200]}
                tick={axis.tick}
                tickLine={axis.line}
                axisLine={axis.line}
                width={34}
                label={{
                  value: "ms",
                  angle: 90,
                  position: "insideRight",
                  offset: 8,
                  ...axis.label,
                }}
              />
            )}
            <Tooltip
              contentStyle={{
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                fontSize: 11,
              }}
            />
            {series
              .filter((s) => visible[s.key])
              .map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  isAnimationActive={false}
                  yAxisId={s.key === "latency" ? "ms" : "mbps"}
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeDasharray={s.dashed ? "5 4" : undefined}
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
