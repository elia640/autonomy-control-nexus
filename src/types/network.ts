import type { LinkStatus } from "@/theme/tacticalTheme";

export type LinkKind = "CELLULAR" | "SATCOM" | "RADIO";

export type ViewMode = "tactical" | "logical";

export interface SimCard {
  label: string;
  quality: number;
}

export interface SatcomState {
  locked: boolean;
  connected: boolean;
}

export interface PlatformUnit {
  id: string;
  label: string;
  /** Percentage position on the map container. */
  x: number;
  y: number;
  status: LinkStatus;
  link: LinkKind;
  quality: number;
  mbps: string;
  lat: string;
  defaultExpanded?: boolean;
  sims?: SimCard[];
  sat?: SatcomState;
}

export interface MeshLink {
  from: string;
  to: string;
  status: LinkStatus;
}

export interface SatelliteLink {
  name: string;
  down: string;
  up: string;
  status: LinkStatus;
}

export interface ThroughputSample {
  t: number;
  upload: number;
  download: number;
  bandwidth: number;
}

export type { LinkStatus };
