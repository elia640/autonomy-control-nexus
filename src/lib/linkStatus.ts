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
