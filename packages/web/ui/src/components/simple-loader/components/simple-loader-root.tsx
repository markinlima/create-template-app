import { Loader2 } from "lucide-react";
import { cn } from "tailwind-variants";

interface SimpleLoaderIconProps {
  className?: string;
}

/** The spinning icon of a {@link SimpleLoaderIcon}. It keeps spinning when the less-motion setting is on. */
export function SimpleLoaderIconRoot({ className }: SimpleLoaderIconProps) {
  return <Loader2 className={cn("text-primary animate-spin", className)} />;
}
