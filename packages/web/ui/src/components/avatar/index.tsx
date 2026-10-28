import { AvatarBadge } from "./avatar-badge";
import { AvatarFallback } from "./avatar-fallback";
import { AvatarGroup } from "./avatar-group";
import { AvatarGroupCount } from "./avatar-group-count";
import { AvatarImage } from "./avatar-image";
import { AvatarRoot } from "./avatar-root";

export const Avatar = Object.assign(AvatarRoot, {
  image: AvatarImage,
  fallback: AvatarFallback,
  badge: AvatarBadge,
  group: AvatarGroup,
  groupCount: AvatarGroupCount,
});

export type { AvatarImageProps } from "./avatar-image";
export type { AvatarSizes } from "./avatar-shared";
