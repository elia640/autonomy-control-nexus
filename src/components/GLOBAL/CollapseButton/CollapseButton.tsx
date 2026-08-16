import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CollapseIconButton } from "./CollapseButton.styles";

export interface CollapseButtonProps {
  expanded: boolean;
  onToggle: () => void;
  /** Accessible name of the collapsible region. */
  label: string;
}

export function CollapseButton({ expanded, onToggle, label }: CollapseButtonProps) {
  return (
    <CollapseIconButton
      size="small"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={`Toggle ${label}`}
    >
      {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
    </CollapseIconButton>
  );
}
