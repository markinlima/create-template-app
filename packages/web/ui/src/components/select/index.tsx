import { SelectContent } from "./select-content";
import { SelectGroup } from "./select-group";
import { SelectItem } from "./select-item";
import { SelectLabel } from "./select-label";
import { SelectRoot } from "./select-root";
import { SelectScrollDownButton } from "./select-scroll-down-button";
import { SelectScrollUpButton } from "./select-scroll-up-button";
import { SelectSeparator } from "./select-separator";
import { SelectTrigger } from "./select-trigger";
import { SelectValue } from "./select-value";

export const Select = Object.assign(SelectRoot, {
  group: SelectGroup,
  value: SelectValue,
  trigger: SelectTrigger,
  content: SelectContent,
  label: SelectLabel,
  item: SelectItem,
  separator: SelectSeparator,
  scrollUpButton: SelectScrollUpButton,
  scrollDownButton: SelectScrollDownButton,
});
