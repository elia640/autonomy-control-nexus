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
    sims: [
      { label: "SIM 1", quality: 84 },
      { label: "SIM 2", quality: 61 },
      { label: "SIM 3", quality: 34 },
    ],
    extraLinks: [
      { modem: "MDM-R1", kind: "RADIO", quality: 64, mbps: "12.4" },
      { modem: "MDM-S1", kind: "SATCOM", quality: 47, mbps: "8.1" },
    ],
  },
  {
    id: "utilA",
    label: "PLATFORM 2",
    x: 68,
    y: 27,
    status: "marginal",
    link: "SATCOM",
    quality: 58,
    mbps: "46.5",
    lat: "120ms",
    defaultExpanded: true,
    sat: { locked: true, connected: true },
    extraLinks: [
      { modem: "MDM-C2", kind: "CELLULAR", quality: 55, mbps: "18.7" },
      { modem: "MDM-R2", kind: "RADIO", quality: 38, mbps: "9.3" },
    ],
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
    sims: [
      { label: "SIM 1", quality: 78 },
      { label: "SIM 2", quality: 66 },
      { label: "SIM 3", quality: 41 },
    ],
    extraLinks: [{ modem: "MDM-R3", kind: "RADIO", quality: 58, mbps: "10.8" }],
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
    extraLinks: [
      { modem: "MDM-C4", kind: "CELLULAR", quality: 44, mbps: "14.2" },
      { modem: "MDM-S4", kind: "SATCOM", quality: 31, mbps: "6.5" },
    ],
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
    extraLinks: [{ modem: "MDM-C5", kind: "CELLULAR", quality: 27, mbps: "7.4" }],
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
