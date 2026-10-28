import { cn } from "tailwind-variants";

export function SkeletonRoot({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("relative overflow-hidden rounded-md bg-accent", className)}
      {...props}
    />
  );
}
