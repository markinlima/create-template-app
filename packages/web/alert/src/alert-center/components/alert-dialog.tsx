import { useEffect, useRef, useState } from "react";

import { Button } from "@web/ui/button";
import { Dialog } from "@web/ui/dialog";

import { ALERT_IMPORTANCE_BEHAVIOR } from "../constants/alert-importance-behavior";
import type { AlertItem } from "../types/alert-item";
import { getAlertButtonLabel } from "../utils/get-alert-button-label";
import { getAlertCooldown } from "../utils/get-alert-cooldown";
import { AlertAcknowledgeButton } from "./alert-acknowledge-button";
import { AlertConfirmation } from "./alert-confirmation";
import { AlertHeading } from "./alert-heading";
import { AlertMarkdown } from "./alert-markdown";
import { AlertPageDots } from "./alert-page-dots";

interface AlertDialogProps {
  /** The alerts to show, in order. The list must not change while the dialog is open. */
  alerts: AlertItem[];
  /** Called when an alert was seen: its button was used, or it was closed. */
  onSeen: (alert: AlertItem) => void;
}

/**
 * The alerts in one dialog that stays open from one alert to the next, so it doesn't close and open again. The button goes
 * to the next alert (and closes the dialog at the last one). An alert can only be closed before the end the ways its importance allows.
 */
export function AlertDialog({ alerts, onSeen }: AlertDialogProps) {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [isDone, setIsDone] = useState(false);
  // ? How far the user got: the alerts before it were already read.
  const [furthestIndex, setFurthestIndex] = useState(0);
  const seenIdsRef = useRef(new Set<string>());
  // ? The alerts whose checkbox was checked. It stays checked when the user comes back to read the alert again.
  const [confirmedIds, setConfirmedIds] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const bodyRef = useRef<HTMLDivElement>(null);

  const alert = alerts[index];
  const hasSeveral = alerts.length > 1;
  const isLast = index === alerts.length - 1;

  // ? The next alert starts from its top, not from where the last one was scrolled to.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `index` is what makes the alert change.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [index]);

  if (!alert || isDone) {
    return null;
  }

  const isRevisit = index < furthestIndex;
  const cooldownSeconds = getAlertCooldown({ ...alert, isRevisit });
  // ? The alerts come most important first, so a low one on the screen means every alert that had to be read was already passed.
  const canDismiss = ALERT_IMPORTANCE_BEHAVIOR[alert.importance].canDismiss;

  function handleAcknowledge() {
    if (!alert) {
      return;
    }

    markSeen(alert);

    if (isLast) {
      setIsOpen(false);
    } else {
      setIndex(index + 1);
      setFurthestIndex((current) => Math.max(current, index + 1));
    }
  }

  function handleConfirmationChange(isChecked: boolean) {
    if (!alert) {
      return;
    }

    setConfirmedIds((current) => {
      const next = new Set(current);

      if (isChecked) {
        next.add(alert.id);
      } else {
        next.delete(alert.id);
      }

      return next;
    });
  }

  function handleBack() {
    setIndex((current) => Math.max(0, current - 1));
  }

  // ? Going back and forward again must not tell that an alert was seen twice.
  function markSeen(seenAlert: AlertItem) {
    if (!seenIdsRef.current.has(seenAlert.id)) {
      seenIdsRef.current.add(seenAlert.id);
      onSeen(seenAlert);
    }
  }

  function handleOpenChange(open: boolean) {
    // ? The X, a click outside and Escape all arrive here: they only close the dialog while the alert on the screen can be closed freely.
    // ? Only this alert counts as seen, the rest comes back the next time.
    if (!open && canDismiss && alert) {
      markSeen(alert);
      setIsOpen(false);
    }
  }

  function handleOpenChangeComplete(open: boolean) {
    if (!open) {
      setIsDone(true);
    }
  }

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <Dialog.content
        hideCloseButton={!canDismiss}
        // ? Several alerts share a dialog of a fixed height, so the button stays in the same place from one to the next.
        className={
          hasSeveral
            ? "h-[90svh] max-h-[90svh] w-[95svw] max-w-3xl"
            : "max-h-[90svh] w-[95svw] max-w-3xl"
        }
      >
        <div
          key={alert.id}
          className="flex min-h-0 flex-1 animate-fade-in flex-col gap-4"
        >
          <AlertHeading type={alert.type} title={alert.title} />
          <div
            ref={bodyRef}
            className="min-h-0 flex-1 overflow-y-auto rounded-lg bg-background p-4"
          >
            <AlertMarkdown>{alert.body}</AlertMarkdown>
          </div>
        </div>
        <Dialog.footer className="flex-col gap-3 sm:flex-col sm:justify-start">
          {!!alert.confirmationLabel && (
            <AlertConfirmation
              label={alert.confirmationLabel}
              isChecked={confirmedIds.has(alert.id)}
              onCheckedChange={handleConfirmationChange}
            />
          )}
          <div className="flex items-center justify-between gap-2">
            <AlertPageDots
              alertIds={alerts.map(({ id }) => id)}
              currentIndex={index}
            />
            {/* ? Said out loud when the alert changes, since the dots are only a picture. */}
            {!!hasSeveral && (
              <p className="sr-only" aria-live="polite">
                {`Aviso ${index + 1} de ${alerts.length}: ${alert.title}`}
              </p>
            )}
            <div className="ml-auto flex items-center gap-2">
              {index > 0 && (
                <Button variant="outline" raised onClick={handleBack}>
                  Voltar
                </Button>
              )}
              <AlertAcknowledgeButton
                key={alert.id}
                label={getAlertButtonLabel({ alert, isLast, hasSeveral })}
                cooldownSeconds={cooldownSeconds}
                requiresConfirmation={!!alert.confirmationLabel && !isRevisit}
                isConfirmed={confirmedIds.has(alert.id)}
                onClick={handleAcknowledge}
              />
            </div>
          </div>
        </Dialog.footer>
      </Dialog.content>
    </Dialog>
  );
}
