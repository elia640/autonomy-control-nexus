import type { ReactNode } from "react";
import { SidePanelRoot, SidePanelScroll } from "./SidePanel.styles";

export interface SidePanelProps {
  side: "left" | "right";
  width?: number;
  /** Pinned content above the scrollable body. */
  header?: ReactNode;
  /** Pinned content below the scrollable body. */
  footer?: ReactNode;
  children: ReactNode;
}

export function SidePanel({ side, width = 300, header, footer, children }: SidePanelProps) {
  return (
    <SidePanelRoot side={side} width={width}>
      {header}
      <SidePanelScroll>{children}</SidePanelScroll>
      {footer}
    </SidePanelRoot>
  );
}
