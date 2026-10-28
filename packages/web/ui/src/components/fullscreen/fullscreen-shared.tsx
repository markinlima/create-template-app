import { createContext, use } from "react";

export interface FullscreenContextProps {
  isOpen: boolean;
  onClose?: () => void;
  handleChangeFullscreenState: (newState: boolean) => void;
  toggleFullscreen: () => void;
  fullscreenState: DialogStateType;
  isTransitioning: IsTransitioningType;
}

export const initialState: FullscreenContextProps = {
  isOpen: false,
  handleChangeFullscreenState: () => {},
  toggleFullscreen: () => {},
  fullscreenState: "closed",
  isTransitioning: undefined,
};

export type DialogStateType = "open" | "closed" | "transitioning";

export type IsTransitioningType = "opening" | "closing" | undefined;

export const FullscreenContext =
  createContext<FullscreenContextProps>(initialState);

export function useFullscreenContext() {
  const context = use(FullscreenContext);
  if (!context) {
    throw new Error(
      "useFullscreenContext must be used within a FullscreenProvider",
    );
  }
  return context;
}

export interface FullscreenPortalProps {
  children: React.ReactNode;
  containerElement?: HTMLElement | null;
}
