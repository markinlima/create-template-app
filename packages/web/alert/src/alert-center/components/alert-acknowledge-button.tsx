import { Button } from "@web/ui/button";

import { useAlertCooldown } from "../hooks/use-alert-cooldown";
import { canAcknowledgeAlert } from "../utils/can-acknowledge-alert";

interface AlertAcknowledgeButtonProps {
  label: string;
  /** Seconds the button waits, counted from when it is shown, before it works. */
  cooldownSeconds: number;
  /** The alert asks for a checkbox to be checked first. */
  requiresConfirmation: boolean;
  isConfirmed: boolean;
  onClick: () => void;
}

/** The button of an alert: it works after the wait and, when the alert asks for it, once the checkbox is checked. */
export function AlertAcknowledgeButton({
  label,
  cooldownSeconds,
  requiresConfirmation,
  isConfirmed,
  onClick,
}: AlertAcknowledgeButtonProps) {
  const remainingSeconds = useAlertCooldown(cooldownSeconds);
  const canAcknowledge = canAcknowledgeAlert({
    remainingSeconds,
    requiresConfirmation,
    isConfirmed,
  });

  return (
    <Button raised disabled={!canAcknowledge} onClick={onClick}>
      {label}
      {remainingSeconds > 0 ? ` (${remainingSeconds}s)` : ""}
    </Button>
  );
}
