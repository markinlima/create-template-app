import { useEffect, useState } from "react";

import {
  type DialogStateType,
  FullscreenContext,
  type FullscreenContextProps,
  type IsTransitioningType,
} from "./fullscreen-shared";

interface FullscreenProviderProps {
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultOpen?: boolean;
  onClose?: () => void;
  delayCloseTime?: number;
  /** When it becomes `true` while open (e.g. a route change), the fullscreen closes. */
  closeOnChange?: boolean;
  children: React.ReactNode;
}

export function FullscreenProvider({
  children,
  onClose,
  onOpenChange,
  isOpen: externalIsOpen,
  delayCloseTime = 200,
  defaultOpen = false,
  closeOnChange = false,
}: FullscreenProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [isTransitioning, setIsTransitioning] =
    useState<IsTransitioningType>(undefined);
  const isFullscreenOpen = externalIsOpen ?? isOpen;
  const fullscreenState: DialogStateType = isOpen
    ? "open"
    : isTransitioning
      ? "transitioning"
      : "closed";

  /**
   * Altera o estado de abertura/fechamento.
   */
  function handleChangeFullscreenState(newState: boolean) {
    if (newState === isFullscreenOpen || isTransitioning) {
      return null;
    }
    setIsTransitioning(newState ? "opening" : "closing");
    if (onOpenChange) {
      onOpenChange(newState);
    } else {
      setIsOpen(newState);
    }

    if (!newState) {
      onClose?.();
    }
    setTimeout(() => {
      setIsTransitioning(undefined);
    }, delayCloseTime);
  }

  function toggleFullscreen() {
    handleChangeFullscreenState(!isFullscreenOpen);
  }

  const value: FullscreenContextProps = {
    isOpen: isFullscreenOpen,
    onClose,
    handleChangeFullscreenState,
    toggleFullscreen,
    fullscreenState,
    isTransitioning,
  };

  useEffect(() => {
    if (closeOnChange && isOpen) {
      handleChangeFullscreenState(false);
    }
  }, [isOpen, closeOnChange, handleChangeFullscreenState]);

  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  );
}
