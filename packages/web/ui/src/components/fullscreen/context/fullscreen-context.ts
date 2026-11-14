import { createContext } from "react";

import type { DialogStateType } from "../types/dialog-state-type";
import type { IsTransitioningType } from "../types/is-transitioning-type";

export interface FullscreenContextProps {
  isOpen: boolean;
  onClose?: () => void;
  handleChangeFullscreenState: (newState: boolean) => void;
  toggleFullscreen: () => void;
  fullscreenState: DialogStateType;
  isTransitioning: IsTransitioningType;
}

/** The state of a fullscreen before any change: closed, with no transition. */
export const initialState: FullscreenContextProps = {
  isOpen: false,
  handleChangeFullscreenState: () => {},
  toggleFullscreen: () => {},
  fullscreenState: "closed",
  isTransitioning: undefined,
};

/** The context of a {@link Fullscreen}: its state and its toggles. It is `null` outside of one. */
export const FullscreenContext =
  createContext<FullscreenContextProps>(initialState);
