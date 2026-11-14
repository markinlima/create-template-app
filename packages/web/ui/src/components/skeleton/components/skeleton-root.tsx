import { cn } from "tailwind-variants";

/** The placeholder block of a {@link Skeleton}. */
export function SkeletonRoot({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent relative overflow-hidden rounded-md", className)}
      {...props}
    />
  );
}
