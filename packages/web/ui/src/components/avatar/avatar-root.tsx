import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "tailwind-variants";

export function AvatarRoot({
  className,
  ...props
}: AvatarPrimitive.Root.Props) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "group/avatar relative flex size-8 shrink-0 select-none rounded-full after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten",
        className,
      )}
      {...props}
    />
  );
}
