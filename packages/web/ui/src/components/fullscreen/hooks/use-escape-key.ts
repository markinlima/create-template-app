import { useEffect, useEffectEvent } from "react";

/**
 * Calls `onEscape` when Escape is pressed anywhere in the page, even while a field has the focus.
 *
 * @param onEscape - Called on each Escape keydown. It always sees the latest render.
 */
export function useEscapeKey(onEscape: () => void) {
  const handleEscape = useEffectEvent(onEscape);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleEscape();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
}
