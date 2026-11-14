import type { Hotkey } from "@tanstack/react-hotkeys";

/** The keys that move the keyboard navigation of a virtual list. */
export interface KeyboardNavigationKeys {
  /** Scrolls to the previous item. */
  previous: Hotkey;
  /** Scrolls to the next item. */
  next: Hotkey;
}
