import { useCallback, useState } from "react";

type UseToggleReturn = [boolean, () => void, (value: boolean) => void];

/**
 * A boolean state with a function that flips it.
 *
 * @param initialValue - The value at the start.
 * @defaultValue false
 * @param onToggle - Called with the new value whenever it changes through the returned functions.
 * @returns A tuple: the value, `toggle` and `setToggle` (to give the value).
 * @example
 * const [isOn, toggle] = useToggle();
 */
export function useToggle(
  initialValue = false,
  onToggle?: (value: boolean) => void,
): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => {
      const newValue = !prev;
      onToggle?.(newValue);
      return newValue;
    });
  }, [onToggle]);

  const setToggle = useCallback(
    (newValue: boolean) => {
      setValue(newValue);
      onToggle?.(newValue);
    },
    [onToggle],
  );

  return [value, toggle, setToggle];
}
