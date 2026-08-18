import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { SeriesCheckbox } from "@/components/GLOBAL/SeriesCheckbox";
import { MESH_FREQUENCY, meshMargins, meshRssi, meshSnr, platforms, relays } from "@/data/network";
import type { LinkStatus, MatrixMetric } from "@/types/network";
import {
  FrequencyLabel,
  FrequencyRow,
  LegendItem,
  LegendSquare,
  MatrixCell,
  MatrixFrame,
  MatrixHeadCell,
  MatrixLegend,
  MatrixModes,
  MatrixRoot,
  MatrixRowHeadCell,
  MatrixTable,
} from "./MeshMatrix.styles";

interface MatrixNode {
  id: string;
  short: string;
  label: string;
}

const GROUND_STATION_ID = "gs";

const nodes: MatrixNode[] = [
  { id: GROUND_STATION_ID, short: "GS", label: "GROUND STATION" },
  ...platforms.map((unit) => ({
    id: unit.id,
    short: `P${unit.label.split(" ")[1]}`,
    label: unit.label,
  })),
  ...relays.map((relay) => ({ id: relay.id, short: "RLY", label: relay.label })),
];

const marginStatus = (margin: number): LinkStatus =>
  margin >= 16 ? "good" : margin >= 10 ? "marginal" : "poor";

const readMargin = (a: string, b: string): number | null => {
  if (a === b) return null;
  return meshMargins[`${a}|${b}`] ?? meshMargins[`${b}|${a}`] ?? 10;
};

const METRICS: { id: MatrixMetric; label: string }[] = [
  { id: "modulation", label: "Modulation" },
  { id: "snr", label: "SNR" },
  { id: "rssi", label: "RSSI" },
];

const UNIT: Record<MatrixMetric, string> = {
  modulation: "dB margin",
  snr: "dB",
  rssi: "dBm",
};

export interface MeshMatrixProps {
  frequency?: string;
  /** Initial display metric. */
  defaultMetric?: MatrixMetric;
}

export function MeshMatrix({
  frequency = MESH_FREQUENCY,
  defaultMetric = "modulation",
}: MeshMatrixProps) {
  const theme = useTheme();
  const [metric, setMetric] = useState<MatrixMetric>(defaultMetric);

  const valueOf = (margin: number): number =>
    metric === "snr" ? meshSnr(margin) : metric === "rssi" ? meshRssi(margin) : margin;

  return (
    <MatrixRoot>
      <MatrixModes>
        {METRICS.map((option) => (
          <SeriesCheckbox
            key={option.id}
            label={option.label}
            color={theme.palette.primary.main}
            checked={metric === option.id}
            onChange={() => setMetric(option.id)}
          />
        ))}
      </MatrixModes>

      <MatrixFrame>
        <MatrixTable>
          <thead>
            <tr>
              <MatrixHeadCell aria-label="Nodes" />
              {nodes.map((node) => (
                <MatrixHeadCell key={node.id} highlighted={node.id === GROUND_STATION_ID}>
                  {node.short}
                </MatrixHeadCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {nodes.map((row) => (
              <tr key={row.id}>
                <MatrixRowHeadCell scope="row" highlighted={row.id === GROUND_STATION_ID}>
                  {row.short}
                </MatrixRowHeadCell>
                {nodes.map((column) => {
                  const margin = readMargin(row.id, column.id);
                  const value = margin === null ? null : valueOf(margin);
                  return (
                    <MatrixCell
                      key={column.id}
                      cellColor={
                        metric !== "modulation" || margin === null
                          ? undefined
                          : theme.palette.status[marginStatus(margin)]
                      }
                      title={`${row.label} ↔ ${column.label}: ${
                        value === null ? "self" : `${value} ${UNIT[metric]}`
                      }`}
                    >
                      {value ?? "—"}
                    </MatrixCell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </MatrixTable>
      </MatrixFrame>

      <FrequencyRow>
        <FrequencyLabel>Frequency</FrequencyLabel>
        <span>{frequency}</span>
      </FrequencyRow>

      {metric === "modulation" ? (
        <MatrixLegend>
          {(["good", "marginal", "poor"] as LinkStatus[]).map((status) => (
            <LegendItem key={status}>
              <LegendSquare swatchColor={theme.palette.status[status]} />
              {status}
            </LegendItem>
          ))}
        </MatrixLegend>
      ) : (
        <MatrixLegend>
          <LegendItem>values in {UNIT[metric]}</LegendItem>
        </MatrixLegend>
      )}
    </MatrixRoot>
  );
}
