import { AvatarBadge } from "./components/avatar-badge";
import { AvatarFallback } from "./components/avatar-fallback";
import { AvatarGroup } from "./components/avatar-group";
import { AvatarGroupCount } from "./components/avatar-group-count";
import { AvatarImage } from "./components/avatar-image";
import { AvatarRoot } from "./components/avatar-root";

/** A user picture with a fallback. Use `Avatar.image`, `Avatar.fallback` and `Avatar.badge`. */
export const Avatar = Object.assign(AvatarRoot, {
  image: AvatarImage,
  fallback: AvatarFallback,
  badge: AvatarBadge,
  group: AvatarGroup,
  groupCount: AvatarGroupCount,
});

export type { AvatarImageProps } from "./components/avatar-image";
export type { AvatarSizes } from "./types/avatar-sizes";
