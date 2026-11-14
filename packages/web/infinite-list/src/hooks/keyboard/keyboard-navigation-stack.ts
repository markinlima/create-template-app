// NOTE: lists with the navigation on, oldest to newest mounted; only the newest reacts
const stack: symbol[] = [];

/**
 * Put a list on top of the stack of lists with keyboard navigation, so a list in a dialog takes over from the page list under it.
 *
 * @param id - Identifies the list.
 * @returns A function that takes the list out of the stack; the list below takes over again.
 */
export function registerKeyboardNavigation(id: symbol) {
  stack.push(id);

  return () => {
    const index = stack.indexOf(id);
    if (index !== -1) {
      stack.splice(index, 1);
    }
  };
}

/**
 * Tell whether a list is the one that reacts to the keyboard.
 *
 * @param id - Identifies the list.
 * @returns `true` when it is the newest list in the stack.
 */
export function isKeyboardNavigationActive(id: symbol) {
  return stack.at(-1) === id;
}
