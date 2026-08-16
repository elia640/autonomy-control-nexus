import { useTheme } from "@mui/material/styles";
import { MESH_FREQUENCY, meshMargins, platforms } from "@/data/network";
import type { LinkStatus } from "@/types/network";
import {
  FrequencyLabel,
  FrequencyRow,
  LegendItem,
  LegendSquare,
  MatrixCell,
  MatrixFrame,
  MatrixHeadCell,
  MatrixLegend,
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
];

const marginStatus = (margin: number): LinkStatus =>
  margin >= 16 ? "good" : margin >= 10 ? "marginal" : "poor";

const readMargin = (a: string, b: string): number | null => {
  if (a === b) return null;
  return meshMargins[`${a}|${b}`] ?? meshMargins[`${b}|${a}`] ?? 10;
};

export interface MeshMatrixProps {
  frequency?: string;
}

export function MeshMatrix({ frequency = MESH_FREQUENCY }: MeshMatrixProps) {
  const theme = useTheme();

  return (
    <MatrixRoot>
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
                  return (
                    <MatrixCell
                      key={column.id}
                      cellColor={
                        margin === null ? undefined : theme.palette.status[marginStatus(margin)]
                      }
                      title={`${row.label} ↔ ${column.label}: ${
                        margin === null ? "self" : `${margin} dB`
                      }`}
                    >
                      {margin ?? "—"}
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

      <MatrixLegend>
        {(["good", "marginal", "poor"] as LinkStatus[]).map((status) => (
          <LegendItem key={status}>
            <LegendSquare swatchColor={theme.palette.status[status]} />
            {status}
          </LegendItem>
        ))}
      </MatrixLegend>
    </MatrixRoot>
  );
}
