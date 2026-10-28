import { cn } from "tailwind-variants";

interface AlertPageDotsProps {
  /** The ids of the alerts of the dialog, in order. */
  alertIds: string[];
  currentIndex: number;
}

/** One dot per alert, the current one marked. It only shows where the user is, it is not a control. */
export function AlertPageDots({ alertIds, currentIndex }: AlertPageDotsProps) {
  if (alertIds.length <= 1) {
    return null;
  }

  return (
    <div
      role="img"
      aria-label={`Aviso ${currentIndex + 1} de ${alertIds.length}`}
      className="flex items-center gap-1.5"
    >
      {alertIds.map((id, index) => (
        <span
          key={id}
          className={cn(
            "size-2 rounded-full transition-colors",
            index === currentIndex ? "bg-primary" : "bg-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}
