import { cn } from "tailwind-variants";

interface GradientCornersProps {
  variants?: "destructive" | "warning" | "default" | "success";
  className?: string;
}

/** Two blurred glows in opposite corners of its parent, which has to be `relative`. It never takes clicks. */
export function GradientCornersRoot({
  variants = "default",
  className,
}: GradientCornersProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "from-primary/20 to-primary/10 absolute -top-4 -right-4 size-24 rounded-full bg-linear-to-br blur-2xl",
          {
            "from-destructive/20 to-destructive/10": variants === "destructive",
            "from-warn/20 to-warn/10": variants === "warning",
            "from-success/20 to-success/10": variants === "success",
          },
        )}
      />
      <div
        className={cn(
          "from-secondary/20 to-secondary/10 absolute -bottom-4 -left-4 size-32 rounded-full bg-linear-to-tr blur-2xl delay-1000",
          {
            "from-destructive/20 to-destructive/10": variants === "destructive",
            "from-warn/20 to-warn/10": variants === "warning",
            "from-success/20 to-success/10": variants === "success",
          },
        )}
      />
    </div>
  );
}
