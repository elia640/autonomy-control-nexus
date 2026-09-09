import type {
  MeshLink,
  PlatformUnit,
  RelayUnit,
  SatelliteLink,
  ThroughputSample,
} from "@/types/network";

export const GROUND_STATION_POSITION = { x: 50, y: 62 };
export const SATELLITE_POSITION = { x: 84, y: 12 };
export const MAX_BANDWIDTH_MBPS = 22;

export const platforms: PlatformUnit[] = [
  {
    id: "apc1",
    label: "PLATFORM 1",
    x: 27,
    y: 33,
    status: "good",
    link: "CELLULAR",
    quality: 82,
    mbps: "47.9",
    lat: "9.7ms",
    defaultExpanded: true,
    cellularModem: { name: "HALO-C1", temperature: 47, cpu: 38, voltage: 12.4 },
    sims: [
      { label: "SIM 1", quality: 84 },
      { label: "SIM 2", quality: 61 },
      { label: "SIM 3", quality: 34 },
    ],
    radioModem: { name: "HALO-R1", temperature: 41, voltage: 12.1 },
    radio: { quality: 64, mbps: "12.4" },
    satModem: { name: "HALO-S1", temperature: 52, cpu: 24, voltage: 12.6 },
    sat: {
      locked: true,
      connected: true,
      metrics: { sinr: 12.4, rsrp: -102, rssi: -71 },
    },
  },
  {
    id: "utilA",
    label: "PLATFORM 2",
    x: 68,
    y: 27,
    status: "marginal",
    link: "SATCOM",
    activeLinks: ["SATCOM", "CELLULAR"],
    quality: 58,
    mbps: "46.5",
    lat: "120ms",
    defaultExpanded: true,
    cellularModem: { name: "HALO-C2", temperature: 63, cpu: 74, voltage: 11.6 },
    sims: [
      { label: "SIM 1", quality: 55 },
      { label: "SIM 2", quality: 48 },
      { label: "SIM 3", quality: 30 },
    ],
    satModem: { name: "HALO-S2", temperature: 58, cpu: 41, voltage: 12.2 },
    sat: {
      locked: true,
      connected: true,
      metrics: { sinr: 8.1, rsrp: -114, rssi: -83 },
    },
    radioModem: { name: "HALO-R2", temperature: 44, voltage: 12.0 },
    radio: { quality: 38, mbps: "9.3" },
  },
  {
    id: "utilB",
    label: "PLATFORM 3",
    x: 80,
    y: 56,
    status: "good",
    link: "CELLULAR",
    quality: 76,
    mbps: "45.9",
    lat: "125ms",
    cellularModem: { name: "HALO-C3", temperature: 49, cpu: 33, voltage: 12.5 },
    sims: [
      { label: "SIM 1", quality: 78 },
      { label: "SIM 2", quality: 66 },
      { label: "SIM 3", quality: 41 },
    ],
    radioModem: { name: "HALO-R3", temperature: 39, voltage: 12.3 },
    radio: { quality: 58, mbps: "10.8" },
  },
  {
    id: "cmd",
    label: "PLATFORM 4",
    x: 30,
    y: 76,
    status: "marginal",
    link: "RADIO",
    quality: 52,
    mbps: "44.5",
    lat: "118ms",
    cellularModem: { name: "HALO-C4", temperature: 55, cpu: 62, voltage: 12.0 },
    sims: [
      { label: "SIM 1", quality: 44 },
      { label: "SIM 2", quality: 37 },
    ],
    satModem: { name: "HALO-S4", temperature: 72, cpu: 88, voltage: 11.2 },
    sat: {
      locked: false,
      connected: false,
      metrics: { sinr: 3.2, rsrp: -126, rssi: -95 },
    },
    radioModem: { name: "HALO-R4", temperature: 43, voltage: 12.2 },
    radio: { quality: 52, mbps: "8.4" },
  },
  {
    id: "tanker",
    label: "PLATFORM 5",
    x: 62,
    y: 86,
    status: "poor",
    link: "RADIO",
    quality: 21,
    mbps: "25.5",
    lat: "120ms",
    cellularModem: { name: "HALO-C5", temperature: 68, cpu: 79, voltage: 11.4 },
    sims: [{ label: "SIM 1", quality: 27 }],
    radioModem: { name: "HALO-R5", temperature: 46, voltage: 11.9 },
    radio: { quality: 21, mbps: "5.1" },
  },
];

/** Platform-to-platform radio mesh links. */
export const radioLinks: MeshLink[] = [
  { from: "apc1", to: "utilA", status: "good" },
  { from: "utilA", to: "utilB", status: "marginal" },
  { from: "cmd", to: "tanker", status: "poor" },
  { from: "apc1", to: "cmd", status: "good" },
];

/** Communication relays; positions are draggable at runtime. */
export const relays: RelayUnit[] = [
  {
    id: "relay1",
    label: "RELAY",
    x: 46,
    y: 45,
    status: "good",
    link: "RADIO",
    quality: 71,
    mbps: "18.2",
    lat: "14ms",
    connectedTo: ["apc1", "utilB", "cmd", "tanker"],
    defaultExpanded: true,
    radioModem: { name: "RLY-M1", temperature: 38, voltage: 12.7 },
    radio: { quality: 71, mbps: "18.2" },
  },
];

export const satelliteLinks: SatelliteLink[] = [
  { name: "TELS-1", down: "15.3", up: "4.2", status: "good" },
  { name: "TELS-2", down: "9.8", up: "2.6", status: "marginal" },
];

/** Link margin (dB) keyed by unordered node pair. */
export const meshMargins: Record<string, number> = {
  "apc1|utilA": 16,
  "apc1|utilB": 26,
  "apc1|cmd": 28,
  "apc1|tanker": 13,
  "utilA|utilB": 15,
  "utilA|cmd": 15,
  "utilA|tanker": 9,
  "utilB|cmd": 16,
  "utilB|tanker": 6,
  "cmd|tanker": 8,
  "gs|apc1": 27,
  "gs|utilA": 18,
  "gs|utilB": 21,
  "gs|cmd": 14,
  "gs|tanker": 7,
  "relay1|apc1": 22,
  "relay1|utilA": 12,
  "relay1|utilB": 19,
  "relay1|cmd": 17,
  "relay1|tanker": 11,
  "relay1|gs": 24,
};

/** SNR (dB) derived from the link margin of the same pair. */
export const meshSnr = (margin: number): number => Math.round(margin * 0.9 + 3);

/** RSSI (dBm) derived from the link margin of the same pair. */
export const meshRssi = (margin: number): number => Math.round(-100 + margin * 1.4);

export const MESH_FREQUENCY = "MESH-A · 2.412 GHz";

export const throughputSamples: ThroughputSample[] = Array.from({ length: 13 }, (_, i) => ({
  t: i * 5,
  download: 9 + Math.sin(i / 1.6) * 3.5 + (i % 3),
  upload: 5 + Math.cos(i / 2) * 2,
  bandwidth: 18 + Math.sin(i / 3) * 4,
}));

export const findPlatform = (id: string): PlatformUnit => {
  const unit = platforms.find((p) => p.id === id);
  if (!unit) throw new Error(`Unknown platform: ${id}`);
  return unit;
};

export const findRelay = (id: string): RelayUnit => {
  const relay = relays.find((r) => r.id === id);
  if (!relay) throw new Error(`Unknown relay: ${id}`);
  return relay;
};
