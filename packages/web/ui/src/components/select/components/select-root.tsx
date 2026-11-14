import { Select as SelectPrimitive } from "@base-ui/react/select";

/** The root of a {@link Select}. */
export function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: SelectPrimitive.Root.Props<Value, Multiple>,
) {
  return <SelectPrimitive.Root {...props} />;
}
