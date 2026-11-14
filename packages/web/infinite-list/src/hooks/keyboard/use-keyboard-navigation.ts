import { useHotkeys } from "@tanstack/react-hotkeys";
import type { ScrollToOptions, VirtualItem } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";

import { DEFAULT_KEYBOARD_NAVIGATION_KEYS } from "../../constants/default-keyboard-navigation-keys";
import type { KeyboardNavigationKeys } from "../../types/keyboard-navigation-keys";
import {
  isKeyboardNavigationActive,
  registerKeyboardNavigation,
} from "./keyboard-navigation-stack";

/** Options of {@link useKeyboardNavigation}. */
interface UseKeyboardNavigationOptions {
  scrollToIndex: (index: number, options?: ScrollToOptions) => void;
  getVirtualItems: () => VirtualItem[];
  getScrollOffset: () => number | null;
  enabled?: boolean;
  keys?: KeyboardNavigationKeys;
}

/** Scrolls to the previous/next item with the keyboard (W/S by default), ignoring typing in inputs. */
export function useKeyboardNavigation({
  scrollToIndex,
  getVirtualItems,
  getScrollOffset,
  enabled = true,
  keys = DEFAULT_KEYBOARD_NAVIGATION_KEYS,
}: UseKeyboardNavigationOptions) {
  const isScrolling = useRef(false);
  const id = useRef(Symbol("keyboard-navigation"));

  useEffect(() => {
    if (!enabled) {
      return;
    }

    return registerKeyboardNavigation(id.current);
  }, [enabled]);

  function handleChangeIndex(direction: 1 | -1) {
    if (
      isScrolling.current ||
      !enabled ||
      !isKeyboardNavigationActive(id.current)
    ) {
      return;
    }

    const virtualItems = getVirtualItems();
    const currentOffset = getScrollOffset();

    if (virtualItems.length === 0 || currentOffset === null) {
      return;
    }

    isScrolling.current = true;

    const currentItem = virtualItems.reduce((previous, current) =>
      Math.abs(current.start - currentOffset) <
      Math.abs(previous.start - currentOffset)
        ? current
        : previous,
    );

    scrollToIndex(currentItem.index + direction, {
      align: "start",
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrolling.current = false;
    }, 250);
  }

  // NOTE: no preventDefault, so the page keeps its own keys; typing in a text field is skipped by the library
  // NOTE: a list with the navigation off registers nothing, so two lists never register the same key
  useHotkeys(
    enabled
      ? [
          { hotkey: keys.previous, callback: () => handleChangeIndex(-1) },
          { hotkey: keys.next, callback: () => handleChangeIndex(1) },
        ]
      : [],
    {
      preventDefault: false,
      stopPropagation: false,
      conflictBehavior: "allow",
    },
  );
}
