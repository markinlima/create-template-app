import {
  InfoIcon,
  type LucideIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from "lucide-react";

import type { AlertVariant } from "../types/content/alert-content";

interface AlertVariantConfig {
  icon: LucideIcon;
  /** The `variant` of the rounded icon of the heading, which gives it its color from the theme. */
  color: "primary" | "info" | "warn";
}

/** The icon and color of the heading of each variant. */
export const ALERT_VARIANT_CONFIG: Record<AlertVariant, AlertVariantConfig> = {
  update: { icon: SparklesIcon, color: "primary" },
  info: { icon: InfoIcon, color: "info" },
  warning: { icon: TriangleAlertIcon, color: "warn" },
};
