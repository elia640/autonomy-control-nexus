import type { ReactNode } from "react";
import { SectionHeaderAction, SectionHeaderBar, SectionHeaderTitle } from "./SectionHeader.styles";

export interface SectionHeaderProps {
  title: string;
  /** Optional trailing content, e.g. an action button. */
  action?: ReactNode;
  /** Slightly stronger styling for the panel's primary title. */
  emphasis?: boolean;
}

export function SectionHeader({ title, action, emphasis }: SectionHeaderProps) {
  return (
    <SectionHeaderBar>
      <SectionHeaderTitle emphasis={emphasis ?? false}>{title}</SectionHeaderTitle>
      {action && <SectionHeaderAction>{action}</SectionHeaderAction>}
    </SectionHeaderBar>
  );
}
