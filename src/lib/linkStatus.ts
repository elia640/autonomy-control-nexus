import { MAX_BANDWIDTH_MBPS } from "@/data/network";
import type { LinkStatus } from "@/types/network";

/** Signal quality (0-100) mapped to the shared status scale. */
export const qualityStatus = (quality: number): LinkStatus =>
  quality >= 70 ? "good" : quality >= 40 ? "marginal" : "poor";

/** Throughput mapped to the shared status scale: over the cap is poor, near it marginal. */
export const rateStatus = (
  mbps: number,
  max: number = MAX_BANDWIDTH_MBPS,
): LinkStatus => (mbps > max ? "poor" : mbps >= max * 0.85 ? "marginal" : "good");

export const parseRate = (value: string | number): number =>
  typeof value === "number" ? value : Number.parseFloat(value);

/** Modem temperature (°C): hot hardware is a fault, warm is a warning. */
export const temperatureStatus = (celsius: number): LinkStatus =>
  celsius >= 65 ? "poor" : celsius >= 55 ? "marginal" : "good";

/** Modem CPU load (%). */
export const cpuStatus = (percent: number): LinkStatus =>
  percent >= 85 ? "poor" : percent >= 70 ? "marginal" : "good";

/** Modem supply voltage (V) against the nominal 12 V rail. */
export const voltageStatus = (volts: number): LinkStatus =>
  volts < 11.5 || volts > 14 ? "poor" : volts < 11.9 || volts > 13.5 ? "marginal" : "good";
