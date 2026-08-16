import type { ReactNode } from "react";
import { SectionHeaderBar, SectionHeaderTitle } from "./SectionHeader.styles";

export interface SectionHeaderProps {
  title: string;
  /** Optional trailing content, e.g. an action button. */
  action?: ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <SectionHeaderBar>
      <SectionHeaderTitle component="h2">{title}</SectionHeaderTitle>
      {action}
    </SectionHeaderBar>
  );
}
