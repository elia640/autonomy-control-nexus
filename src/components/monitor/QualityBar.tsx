import { cn } from "@/lib/utils";

export function QualityBar({ value, disabled }: { value: number; disabled?: boolean }) {
  return (
    <div
      className={cn(
        "relative h-[7px] w-full overflow-hidden rounded-full bg-muted",
        disabled && "opacity-30",
      )}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background:
            "linear-gradient(90deg, var(--color-poor), var(--color-marginal) 45%, var(--color-good))",
        }}
      />
    </div>
  );
}
