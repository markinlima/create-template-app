import { useEffect, useState } from "react";

import type { CurrentBreakpoint } from "../types/current-breakpoint";
import { getCurrentBreakpoint } from "../utils/mobile/get-current-breakpoint";

/**
 * Tells whether the visitor is on a mobile device and whether the layout is the mobile one, and updates when the window is resized.
 *
 * @returns See `CurrentBreakpoint`.
 * @example
 * const { isMobileLayout } = useIsMobile();
 */
export function useIsMobile(): CurrentBreakpoint {
  const [breakpointInfo, setBreakpointInfo] = useState(getCurrentBreakpoint);

  useEffect(() => {
    const calculateLayout = () => setBreakpointInfo(getCurrentBreakpoint());

    window.addEventListener("resize", calculateLayout);
    return () => window.removeEventListener("resize", calculateLayout);
  }, []);

  return breakpointInfo;
}
