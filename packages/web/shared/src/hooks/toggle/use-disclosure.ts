import { useCallback, useRef, useState } from "react";

import type { DisclosureCallbacks } from "../../types/disclosure-callbacks";

/**
 * The open and closed state of something (a dialog, a menu) with the functions that change it. The callbacks run only when the state
 * really changes, and the latest ones are used without the functions changing.
 *
 * @param initialState - Whether it starts open.
 * @defaultValue false
 * @param callbacks - See `DisclosureCallbacks`.
 * @returns A tuple: whether it is open and `{ open, close, toggle }`.
 * @example
 * const [isOpen, { open, close }] = useDisclosure(false, { onClose: reset });
 */
export function useDisclosure(
  initialState = false,
  callbacks?: DisclosureCallbacks,
): [boolean, { open: () => void; close: () => void; toggle: () => void }] {
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        callbacksRef.current?.onOpen?.();
        return true;
      }
      return prev;
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        callbacksRef.current?.onClose?.();
        return false;
      }
      return prev;
    });
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        callbacksRef.current?.onClose?.();
        return false;
      }
      callbacksRef.current?.onOpen?.();
      return true;
    });
  }, []);

  return [isOpen, { open, close, toggle }];
}
