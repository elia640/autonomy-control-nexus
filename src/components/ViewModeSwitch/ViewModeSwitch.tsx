import type { ViewMode } from "@/types/network";
import { ModeToggleButton, ModeToggleGroup } from "./ViewModeSwitch.styles";

export interface ViewModeSwitchProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const MODES: { value: ViewMode; label: string }[] = [
  { value: "tactical", label: "Tactical" },
  { value: "logical", label: "Logical" },
];

export function ViewModeSwitch({ mode, onModeChange }: ViewModeSwitchProps) {
  return (
    <ModeToggleGroup
      exclusive
      size="small"
      value={mode}
      onChange={(_, next: ViewMode | null) => next && onModeChange(next)}
      aria-label="View mode"
    >
      {MODES.map((option) => (
        <ModeToggleButton key={option.value} value={option.value} aria-label={option.label}>
          {option.label}
        </ModeToggleButton>
      ))}
    </ModeToggleGroup>
  );
}
