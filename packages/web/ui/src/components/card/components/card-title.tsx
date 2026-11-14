import { cn } from "tailwind-variants";

/** The title of a {@link Card}. */
export function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "flex items-center gap-2 text-base leading-snug font-medium",
        className,
      )}
      {...props}
    />
  );
}
