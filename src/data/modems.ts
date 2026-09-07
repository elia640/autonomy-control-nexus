import { platforms } from "@/data/network";
import type {
  ChannelState,
  ModemAsset,
  ModemChannel,
  RadioAsset,
  SatMetrics,
  ThroughputSample,
} from "@/types/network";

const channel = (
  label: string,
  state: ChannelState,
  quality: number,
  rate: number,
  metrics?: SatMetrics,
): ModemChannel => ({
  id: label.toLowerCase().replace(/\s+/g, "-"),
  label,
  state,
  quality,
  rate,
  ...(metrics ? { metrics } : {}),
});

/** Deterministic RF readouts for a satellite channel, shown in its tooltip. */
const satMetrics = (quality: number): SatMetrics => ({
  sinr: Number((2 + quality / 8).toFixed(1)),
  rsrp: Number((-118 + quality / 4).toFixed(1)),
  rssi: Number((-95 + quality / 5).toFixed(1)),
});

/** Modem of the control room itself. */
export const controlRoomModem: ModemAsset = {
  id: "cr-modem",
  name: "MODEM CONVOY 23",
  quality: 78,
  rate: 14.2,
  rateLabel: "UPLOAD (RX)",
  cpuTemperature: 52,
  cpuLoad: 41,
  channels: [
    channel("SIM 1", "connected", 84, 12.4),
    channel("SIM 2", "connected", 61, 9.1),
    channel("SIM 3", "disconnected", 18, 0),
    channel("SIM 4", "absent", 0, 0),
    channel("ONEWEB", "connected", 72, 15.8, satMetrics(72)),
    channel("STARLINK", "unplugged", 0, 0, satMetrics(0)),
  ],
};

export const controlRoomRadio: RadioAsset = {
  id: "cr-radio",
  name: "RADIO CR VHF-7",
  quality: 64,
  rate: 8.6,
  rateLabel: "DOWNLOAD (RX)",
  temperature: 44,
  voltage: 12.3,
};

/** Modem panel data for a selected vehicle. */
export const vehicleModem = (platformId: string): ModemAsset => {
  const unit = platforms.find((p) => p.id === platformId);
  const base = unit?.quality ?? 60;
  const sims = unit?.sims ?? [];
  const health = unit?.cellularModem;

  return {
    id: `${platformId}-modem`,
    name: "J8",
    quality: base,
    rate: Number.parseFloat(unit?.mbps ?? "0"),
    rateLabel: "UPLOAD (RX)",
    cpuTemperature: health?.temperature ?? 48,
    cpuLoad: health?.cpu ?? 35,
    channels: [
      ...Array.from({ length: 4 }, (_, i) => {
        const sim = sims[i];
        if (!sim) return channel(`SIM ${i + 1}`, "absent", 0, 0);
        const state: ChannelState = sim.quality >= 25 ? "connected" : "disconnected";
        return channel(sim.label, state, sim.quality, Number((sim.quality / 6).toFixed(1)));
      }),
      unit?.sat?.connected
        ? channel(
            "ONEWEB",
            "connected",
            Math.max(30, base - 12),
            11.4,
            unit?.sat?.metrics ?? satMetrics(Math.max(30, base - 12)),
          )
        : channel("ONEWEB", unit?.satModem ? "disconnected" : "unplugged", 0, 0),
      channel(
        "STARLINK",
        unit?.sat?.locked ? "connected" : "unplugged",
        unit?.sat?.locked ? 66 : 0,
        unit?.sat?.locked ? 17.2 : 0,
        satMetrics(unit?.sat?.locked ? 66 : 0),
      ),
    ],
  };
};

export const vehicleRadio = (platformId: string): RadioAsset => {
  const unit = platforms.find((p) => p.id === platformId);
  return {
    id: `${platformId}-radio`,
    name: unit?.radioModem?.name ?? "RADIO",
    quality: unit?.radio?.quality ?? 0,
    rate: Number.parseFloat(unit?.radio?.mbps ?? "0"),
    rateLabel: "UPLOAD (RX)",
    temperature: unit?.radioModem?.temperature ?? 42,
    voltage: unit?.radioModem?.voltage ?? 12.2,
  };
};

/** Deterministic monitoring series so each modem keeps a stable signature. */
export const monitoringSamples = (seed: number): ThroughputSample[] =>
  Array.from({ length: 13 }, (_, i) => ({
    t: i * 5,
    download: 9 + Math.sin((i + seed) / 1.6) * 3.5 + (i % 3),
    upload: 5 + Math.cos((i + seed) / 2) * 2,
    bandwidth: 18 + Math.sin((i + seed) / 3) * 4,
    latency: 90 + Math.sin((i + seed) / 2.2) * 25 + (i % 4) * 3,
  }));
