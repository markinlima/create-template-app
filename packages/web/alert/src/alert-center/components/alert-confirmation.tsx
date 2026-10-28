import { Checkbox } from "@web/ui/checkbox";

interface AlertConfirmationProps {
  label: string;
  isChecked: boolean;
  onCheckedChange: (isChecked: boolean) => void;
}

/** The checkbox an alert can ask to be checked before its button works. The text is part of the click area. */
export function AlertConfirmation({
  label,
  isChecked,
  onCheckedChange,
}: AlertConfirmationProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: The label wraps the checkbox, whose input is inside the component, out of Biome's sight.
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
      <Checkbox
        checked={isChecked}
        onCheckedChange={(checked) => onCheckedChange(checked)}
        className="mt-0.5"
      />
      <span>{label}</span>
    </label>
  );
}
