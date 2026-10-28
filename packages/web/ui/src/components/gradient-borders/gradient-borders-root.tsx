import { cn } from "tailwind-variants";

interface GradientBordersProps {
  variants?: "destructive" | "warning" | "default" | "success";
}

export function GradientBordersRoot({
  variants = "default",
}: GradientBordersProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className={cn(
          "absolute -top-4 -right-4 size-24 rounded-full bg-linear-to-br from-primary/20 to-primary/10 blur-2xl",
          {
            "from-destructive/20 to-destructive/10": variants === "destructive",
            "from-warn/20 to-warn/10": variants === "warning",
            "from-success/20 to-success/10": variants === "success",
          },
        )}
      />
      <div
        className={cn(
          "absolute -bottom-4 -left-4 size-32 rounded-full bg-linear-to-tr from-secondary/20 to-secondary/10 blur-2xl delay-1000",
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
