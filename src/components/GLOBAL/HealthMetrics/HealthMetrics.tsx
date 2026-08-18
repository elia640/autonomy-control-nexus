import BoltIcon from "@mui/icons-material/Bolt";
import CpuIcon from "@mui/icons-material/Memory";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import { cpuStatus, temperatureStatus, voltageStatus } from "@/lib/linkStatus";
import { MetricChip, MetricsRow } from "./HealthMetrics.styles";

export interface HealthMetricsProps {
  /** Celsius. */
  temperature?: number;
  /** Percent; omit for modems that do not report CPU (radio). */
  cpu?: number;
  /** Volts. */
  voltage?: number;
  /** Compact variant used inside map overlay cards. */
  dense?: boolean;
}

export function HealthMetrics({ temperature, cpu, voltage, dense }: HealthMetricsProps) {
  if (temperature === undefined && cpu === undefined && voltage === undefined) return null;

  return (
    <MetricsRow dense={dense ?? false}>
      {temperature !== undefined && (
        <MetricChip tone={temperatureStatus(temperature)} title={`Temperature ${temperature}°C`}>
          <ThermostatIcon /> {temperature}°C
        </MetricChip>
      )}
      {cpu !== undefined && (
        <MetricChip tone={cpuStatus(cpu)} title={`CPU load ${cpu}%`}>
          <CpuIcon /> {cpu}%
        </MetricChip>
      )}
      {voltage !== undefined && (
        <MetricChip tone={voltageStatus(voltage)} title={`Supply voltage ${voltage} V`}>
          <BoltIcon /> {voltage.toFixed(1)}V
        </MetricChip>
      )}
    </MetricsRow>
  );
}
