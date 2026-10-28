import { cn } from "tailwind-variants";

export function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "flex items-center gap-2 font-medium text-base leading-snug",
        className,
      )}
      {...props}
    />
  );
}
