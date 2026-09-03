/** Deterministic round-trip latency estimate (ms) derived from link quality. */
export const estimateLatency = (quality: number): number =>
  Math.max(18, Math.round(160 - quality * 1.1));
