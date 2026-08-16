import { ToggleThumb, ToggleTrack } from "./PowerToggle.styles";

export interface PowerToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name, e.g. "PLATFORM 1 SIM 2". */
  label: string;
  disabled?: boolean;
}

export function PowerToggle({ checked, onChange, label, disabled }: PowerToggleProps) {
  return (
    <ToggleTrack
      on={checked}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <ToggleThumb on={checked} />
    </ToggleTrack>
  );
}
