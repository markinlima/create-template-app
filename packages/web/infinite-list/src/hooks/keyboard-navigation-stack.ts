/**
 * Lists with the keyboard navigation on, from the oldest to the newest mounted. Only the newest
 * one reacts, so a list inside a dialog doesn't scroll together with the page's list under it,
 * and the page's list takes over again when the dialog's one unmounts.
 */
const stack: symbol[] = [];

export function registerKeyboardNavigation(id: symbol) {
  stack.push(id);

  return () => {
    const index = stack.indexOf(id);
    if (index !== -1) {
      stack.splice(index, 1);
    }
  };
}

export function isKeyboardNavigationActive(id: symbol) {
  return stack.at(-1) === id;
}
