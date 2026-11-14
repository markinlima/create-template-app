/** Callbacks of `useDisclosure`, called only when the state really changes. */
export interface DisclosureCallbacks {
  /** Called when it goes from closed to open. */
  onOpen?: () => void;
  /** Called when it goes from open to closed. */
  onClose?: () => void;
}
