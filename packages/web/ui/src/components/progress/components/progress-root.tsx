import { cn } from "tailwind-variants";

interface ProgressProps {
  value: number;
  className?: string;
  classNameIndicator?: string;
  max?: number;
}

/** The root of a {@link Progress} bar. */
export function ProgressRoot({
  className,
  classNameIndicator,
  max = 100,
  value,
}: ProgressProps) {
  const parsedValue = value > max ? max : value;

  return (
    <div
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden bg-transparent",
        className,
      )}
    >
      <div
        data-slot="progress-indicator"
        className={cn(
          "bg-primary size-full flex-1 transition-all",
          classNameIndicator,
        )}
        style={{ transform: `translateX(-${100 - (parsedValue || 0)}%)` }}
      />
    </div>
  );
}
