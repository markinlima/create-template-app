import { SelectContent } from "./components/select-content";
import { SelectGroup } from "./components/select-group";
import { SelectItem } from "./components/select-item";
import { SelectLabel } from "./components/select-label";
import { SelectRoot } from "./components/select-root";
import { SelectScrollDownButton } from "./components/select-scroll-down-button";
import { SelectScrollUpButton } from "./components/select-scroll-up-button";
import { SelectSeparator } from "./components/select-separator";
import { SelectTrigger } from "./components/select-trigger";
import { SelectValue } from "./components/select-value";

/** A dropdown that picks one option from a list. Use `Select.trigger`, `Select.content`, `Select.item` and the other parts. */
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
