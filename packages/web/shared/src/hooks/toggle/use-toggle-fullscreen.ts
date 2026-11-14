import { useCallback, useEffect, useRef, useState } from "react";

import type { FullscreenRef } from "../../types/fullscreen";
import { addFullscreenListener } from "../../utils/fullscreen/add-fullscreen-listener";
import { exitFullscreen } from "../../utils/fullscreen/exit-fullscreen";
import { getFullscreenElement } from "../../utils/fullscreen/get-fullscreen-element";
import { removeFullscreenListener } from "../../utils/fullscreen/remove-fullscreen-listener";
import { requestFullscreen } from "../../utils/fullscreen/request-fullscreen";

/**
 * Takes an element (or the whole page) to fullscreen and follows its state, in any browser.
 *
 * @param ref - The element to take to fullscreen.
 * @defaultValue null, which takes the whole page.
 * @returns A tuple: whether the element is in fullscreen, `enter`, `exit` and `toggle`.
 * @example
 * const [isFullscreen, enter, exit, toggle] = useFullscreen(playerRef);
 */
export function useFullscreen(
  ref: FullscreenRef = null,
): [boolean, () => void, () => void, () => void] {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const refCached = useRef(ref);

  useEffect(() => {
    refCached.current = ref;
  }, [ref]);

  const handleChange = useCallback(() => {
    const current = refCached.current?.current ?? document.documentElement;
    setIsFullscreen(getFullscreenElement() === current);
  }, []);

  useEffect(() => {
    addFullscreenListener(handleChange);
    handleChange();
    return () => {
      removeFullscreenListener(handleChange);
    };
  }, [handleChange]);

  const enter = useCallback(() => {
    const el = refCached.current?.current ?? document.documentElement;
    if (el && getFullscreenElement() !== el) {
      requestFullscreen(el);
    }
  }, []);

  const exit = useCallback(() => {
    if (getFullscreenElement()) {
      exitFullscreen();
    }
  }, []);

  const toggle = useCallback(() => {
    if (isFullscreen) {
      exit();
    } else {
      enter();
    }
  }, [enter, exit, isFullscreen]);

  return [isFullscreen, enter, exit, toggle];
}
