import {
  GavelIcon,
  InfoIcon,
  type LucideIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from "lucide-react";

import type { AlertType } from "../types/alert-item";

interface AlertTypeConfig {
  icon: LucideIcon;
  /** The variant of the rounded icon of the title, which gives it its color from the theme. */
  variant: "primary" | "info" | "warn" | "destructive";
}

export const ALERT_TYPE_CONFIG: Record<AlertType, AlertTypeConfig> = {
  update: { icon: SparklesIcon, variant: "primary" },
  info: { icon: InfoIcon, variant: "info" },
  warning: { icon: TriangleAlertIcon, variant: "warn" },
  punishment: { icon: GavelIcon, variant: "destructive" },
};
