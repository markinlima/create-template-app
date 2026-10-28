import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "tailwind-variants";

interface CompactContainerItemProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function CompactContainerItem({
  children,
  className,
  ...props
}: CompactContainerItemProps) {
  return (
    <button
      {...props}
      className={cn(
        "group/item relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 bg-accent hover:border-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}
