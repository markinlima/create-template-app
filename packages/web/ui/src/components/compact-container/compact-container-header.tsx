import type { HTMLAttributes } from "react";
import { cn } from "tailwind-variants";

interface CompactContainerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function CompactContainerHeader({
  children,
  className,
  title,
}: CompactContainerHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-8.75 items-center justify-between border-b",
        className,
      )}
    >
      {!!title && <h2 className="p-2 font-bold text-sm">{title}</h2>}
      {children}
    </div>
  );
}
