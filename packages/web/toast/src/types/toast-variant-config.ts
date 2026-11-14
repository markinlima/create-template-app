import type { LucideIcon } from "lucide-react";

/** The icon and colors of one basic toast variant. */
export interface ToastVariantConfig {
  icon: LucideIcon;
  /** Classes of the tinted gradient behind the toast, e.g. `from-success/10`. */
  className?: string;
  /** Classes of the icon, e.g. `fill-success`. */
  iconClassName?: string;
}
