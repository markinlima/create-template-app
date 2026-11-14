/** Props of the fullscreen portal: what it renders and where it is mounted. */
export interface FullscreenPortalProps {
  children: React.ReactNode;
  /** The element the portal is mounted in. @defaultValue document.body */
  containerElement?: HTMLElement | null;
}
