import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "tailwind-variants";

export interface AvatarImageProps
  extends Omit<AvatarPrimitive.Image.Props, "src"> {
  src: string | undefined | null;
}

export function AvatarImage({ className, src, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      src={src as string | undefined}
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      {...props}
    />
  );
}
