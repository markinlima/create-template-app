import { Dialog } from "@web/ui/dialog";
import { RoundedIcon } from "@web/ui/rounded-icon";

import { ALERT_TYPE_CONFIG } from "../constants/alert-type-config";
import type { AlertType } from "../types/alert-item";

interface AlertHeadingProps {
  type: AlertType;
  title: string;
}

export function AlertHeading({ type, title }: AlertHeadingProps) {
  const { icon: Icon, variant } = ALERT_TYPE_CONFIG[type];

  return (
    <Dialog.header className="pr-8">
      <Dialog.title>
        <RoundedIcon variant={variant}>
          <Icon />
        </RoundedIcon>
        {title}
      </Dialog.title>
    </Dialog.header>
  );
}
