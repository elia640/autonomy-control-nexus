import type { ReactNode } from "react";
import { LayoutRoot } from "./MonitorLayout.styles";

export interface MonitorLayoutProps {
  children: ReactNode;
}

/** Full-height three-column shell: left panel, viewport, right panel. */
export function MonitorLayout({ children }: MonitorLayoutProps) {
  return <LayoutRoot>{children}</LayoutRoot>;
}
