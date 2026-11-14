import { type ComponentProps, useEffect, useRef } from "react";
import { cn } from "tailwind-variants";

import { useAlertQueue } from "../../hooks/queue/use-alert-queue";

/** Props of `AlertCenter.body`: those of a `div`, except `ref`. */
export type AlertBodyProps = Omit<ComponentProps<"div">, "ref">;

/** The box of an alert that scrolls when the content is long. The next alert starts from its top. Needs the alert dialog. */
export function AlertBody({ className, ...props }: AlertBodyProps) {
  const { index } = useAlertQueue();
  const ref = useRef<HTMLDivElement>(null);

  // NOTE: the next alert starts from its top, not from where the last one was scrolled to.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `index` is what makes the alert change.
  useEffect(() => {
    ref.current?.scrollTo({ top: 0 });
  }, [index]);

  return (
    <div
      ref={ref}
      className={cn(
        "bg-background min-h-0 flex-1 overflow-y-auto rounded-lg p-4",
        className,
      )}
      {...props}
    />
  );
}
