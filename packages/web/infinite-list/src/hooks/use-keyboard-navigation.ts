import type { ScrollToOptions, VirtualItem } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";

import { useIsInputFocused } from "@web/shared/hooks/use-is-input-focused";
import { useKeypress } from "@web/shared/hooks/use-key-press";

import {
  isKeyboardNavigationActive,
  registerKeyboardNavigation,
} from "./keyboard-navigation-stack";

export interface KeyboardNavigationKeys {
  previous: string;
  next: string;
}

export const DEFAULT_KEYBOARD_NAVIGATION_KEYS: KeyboardNavigationKeys = {
  previous: "w",
  next: "s",
};

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
  const isInputFocused = useIsInputFocused();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    return registerKeyboardNavigation(id.current);
  }, [enabled]);

  function handleChangeIndex(event: KeyboardEvent) {
    if (
      isScrolling.current ||
      !enabled ||
      isInputFocused ||
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

    const direction = event.key.toLowerCase() === keys.next ? 1 : -1;

    scrollToIndex(currentItem.index + direction, {
      align: "start",
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrolling.current = false;
    }, 250);
  }

  useKeypress({
    combo: [keys.previous, keys.next],
    callback: handleChangeIndex,
  });
}
