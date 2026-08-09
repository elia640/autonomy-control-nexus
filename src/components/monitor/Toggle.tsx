import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? "toggle"}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[14px] w-[26px] shrink-0 rounded-full border transition-colors",
        checked ? "border-primary/70 bg-primary/30" : "border-border bg-muted",
      )}
    >
      <span
        className={cn(
          "absolute top-[1px] h-[10px] w-[10px] rounded-full transition-all",
          checked ? "left-[13px] bg-primary" : "left-[1px] bg-muted-foreground",
        )}
      />
    </button>
  );
}
