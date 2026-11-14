import { Dialog } from "@web/ui/dialog";
import { RoundedIcon } from "@web/ui/rounded-icon";

import { ALERT_VARIANT_CONFIG } from "../../constants/alert-variant-config";
import type { AlertVariant } from "../../types/content/alert-content";

/** Props of {@link AlertHeading}. */
interface AlertHeadingProps {
  /**
   * Picks the icon and the color.
   * @defaultValue "info"
   */
  variant?: AlertVariant;
  /** Text of the heading. */
  title: string;
}

/** Heading of the dialog: the icon and color of the variant, and the title. */
export function AlertHeading({ variant = "info", title }: AlertHeadingProps) {
  const { icon: Icon, color } = ALERT_VARIANT_CONFIG[variant];

  return (
    <Dialog.header className="pr-8">
      <Dialog.title>
        <RoundedIcon variant={color}>
          <Icon />
        </RoundedIcon>
        {title}
      </Dialog.title>
    </Dialog.header>
  );
}
