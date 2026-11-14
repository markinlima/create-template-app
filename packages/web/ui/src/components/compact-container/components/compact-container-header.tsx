import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "tailwind-variants";

interface CompactContainerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  /** Shown before the title. */
  icon?: ReactNode;
}

/** The header of a {@link CompactContainer}. */
export function CompactContainerHeader({
  children,
  className,
  title,
  icon,
}: CompactContainerHeaderProps) {
  return (
    <div
      className={cn(
        // ? Above the items: what scrolls under it (their badges and labels are positioned) must not paint over its border.
        "bg-background relative z-20 flex h-8.75 shrink-0 items-center justify-between border-b",
        className,
      )}
    >
      {!!title && (
        <h2 className="flex items-center gap-2 p-2 text-sm font-bold [&_svg]:size-4 [&_svg]:shrink-0">
          {icon}
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
