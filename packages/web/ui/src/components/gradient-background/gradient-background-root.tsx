import { cn } from "tailwind-variants";

interface GradientBackgroundProps {
  variants?: "destructive" | "warning" | "default";
  className?: string;
}

export function GradientBackgroundRoot({
  variants = "default",
  className,
}: GradientBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10",
        {
          "from-destructive/10 to-destructive/10": variants === "destructive",
          "from-warn/10 to-warn/10": variants === "warning",
        },
        className,
      )}
    />
  );
}
