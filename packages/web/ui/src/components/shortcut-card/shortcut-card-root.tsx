import type { ComponentProps } from "react";

interface ShortcutCardProps extends ComponentProps<"div"> {
  label: string;
}

export function ShortcutCardRoot({
  label,
  children,
  ...props
}: ShortcutCardProps) {
  return (
    <div className="flex items-center gap-2" {...props}>
      <div className="relative flex size-8 items-center justify-center rounded-md border-2 text-muted-foreground text-sm">
        {children}
      </div>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}
