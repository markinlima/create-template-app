import type { StateStorage } from "zustand/middleware";

/** `localStorage` that never throws: it can be blocked (private mode, disabled site data), and then nothing persists. */
export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // NOTE: the choice just won't persist
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // NOTE: nothing to remove when storage is blocked
    }
  },
};
