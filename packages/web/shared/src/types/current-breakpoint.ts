/** What `useIsMobile` tells about the device and the layout. */
export interface CurrentBreakpoint {
  /** `true` when the device is probably a phone or a tablet. */
  isMobileDevice: boolean;
  /** `true` when the WIDTH of the screen is below the 'lg' breakpoint (1024px). */
  isMobileLayout: boolean;
}
