import {
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
} from "lucide-react";

import type { ToastVariant, ToastVariantConfig } from "./types";

/** Icon and colors of each basic toast. Every color comes from the app theme tokens. */
export const defaultToastVariants: Record<ToastVariant, ToastVariantConfig> = {
  error: {
    icon: CircleXIcon,
    className: "from-destructive/10",
    iconClassName: "fill-destructive",
  },
  info: {
    icon: InfoIcon,
    className: "from-info/10",
    iconClassName: "fill-info",
  },
  success: {
    icon: CircleCheckIcon,
    className: "from-success/10",
    iconClassName: "fill-success",
  },
  warning: {
    icon: CircleAlertIcon,
    className: "from-warn/10",
    iconClassName: "fill-warn",
  },
};
