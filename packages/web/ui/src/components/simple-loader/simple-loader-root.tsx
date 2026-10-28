import { Loader2 } from "lucide-react";
import { cn } from "tailwind-variants";

interface SimpleLoaderIconProps {
  className?: string;
}

export function SimpleLoaderIconRoot({ className }: SimpleLoaderIconProps) {
  return <Loader2 className={cn("animate-spin text-primary", className)} />;
}
