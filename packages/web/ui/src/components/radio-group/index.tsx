import { RadioGroupItem } from "./components/radio-group-item";
import { RadioGroupRoot } from "./components/radio-group-root";

/** A group of options where one is selected. Use `RadioGroup.item` for each one. */
export const RadioGroup = Object.assign(RadioGroupRoot, {
  item: RadioGroupItem,
});
