import { cn } from "tailwind-variants";

interface GradientBackgroundProps {
  variants?: "destructive" | "warning" | "default";
  className?: string;
}

/** The root of a {@link GradientBackground}. */
export function GradientBackgroundRoot({
  variants = "default",
  className,
}: GradientBackgroundProps) {
  return (
    <div
      className={cn(
        "from-primary/10 to-secondary/10 absolute inset-0 bg-linear-to-br via-transparent",
        {
          "from-destructive/10 to-destructive/10": variants === "destructive",
          "from-warn/10 to-warn/10": variants === "warning",
        },
        className,
      )}
    />
  );
}
