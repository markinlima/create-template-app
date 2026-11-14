/** What {@link useDotButton} returns: the selected dot, the snap positions and the click handler. */
export interface DotButtonState {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
}
