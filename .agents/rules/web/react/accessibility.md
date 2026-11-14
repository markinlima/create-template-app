---

paths:

- "apps/web/**"
- "packages/web/**"

---

# Accessibility

Every page, component and lib of the web follows these standards:

- **[WCAG 2.2](https://www.w3.org/TR/WCAG22/), level AA**: the requirements
  for everything the user sees and does.
- **[WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/)
  (APG)**: the keyboard behaviour, roles and states of each widget pattern. When
  a pattern exists in the APG, build it as the APG describes.
- **The HTML specification**: the native element comes first, and ARIA only fills
  what HTML cannot say.

When a rule here and the standard disagree, the standard wins and the rule is
updated. The criteria below are the ones most often broken; the numbers are the
WCAG success criteria.

## 1. Native first

- Use the element that already has the role: `button`, `a`, `input`, `select`,
  `dialog`, `nav`, `main`, `header`, `h1`–`h6`, `ul` and `table`. An `aria-*`
  attribute on a `div` is almost always a sign that a native element was missed.
- **Anything clickable is a `button` or a link** (4.1.2). Never a `div` with
  `onClick`. A link navigates; a button does something.
- **Never nest interactive elements** (no button inside a link, no link inside
  a button).
- To make another element trigger something, pass the trigger element through the
  `render` prop of Base UI (`useRender`, `mergeProps`), like
  `Dialog.trigger render={<Button />}`, so there is one interactive element with
  its native keyboard behaviour.
- When a `div` cannot be avoided, it gets `role`, `tabIndex={0}`, and the keys the
  APG pattern needs. Do not add a `role` only to silence the linter; if the rule
  is wrong for the case, ignore it with a reason.

## 2. Names, labels and text alternatives

- **Every control has an accessible name** (4.1.2, 2.5.3). An icon-only button
  has an `aria-label` in pt-BR that follows its state ("Pausar" and "Reproduzir",
  "Silenciar" and "Ativar som"). If the visible text is a label, the accessible
  name contains that text, so speech users can say it.
- **Every input has a `<label>`** (1.3.1, 3.3.2), visible. A placeholder is not a
  label. Descriptions and errors are linked to the field with `aria-describedby`.
- **Images**: an informative image has an `alt` in pt-BR that says what it means
  (1.1.1). A decorative one has `alt=""`. An SVG icon that is decorative has
  `aria-hidden="true"`.
- **Media**: a video has captions (1.2.2) and an audio has a transcript (1.2.1)
  when they are not decorative.
- **The page language** is declared (3.1.1): `<html lang="pt">`, as in the app
  template. A part in another language gets its own `lang`.

## 3. Structure

- **One `h1` per page**, and the heading levels never skip (1.3.1). Headings
  describe the content, not the look: pick the level by the structure and the
  size with the classes.
- **Landmarks**: the page has one `main`, and the shell has `header` and `nav`
  where they exist. A repeated region of the layout is a landmark, not a `div`.
- **Lists are lists** (`ul`, `ol`), tables are tables with `th` and `scope`.
- The reading order is the DOM order (1.3.2). Visual reordering with CSS must
  not change the order that matters.

## 4. Keyboard and focus

- **Everything that works with a mouse works with the keyboard** (2.1.1). Tab moves
  through the controls in a logical order (2.4.3).
- **The focus is always visible** (2.4.7, 2.4.11): a visible ring on
  `:focus-visible` of each control, not hidden by a sticky header or another
  element. Never remove the outline without a replacement.
- **No keyboard trap** (2.1.2), except inside a modal dialog, where the focus stays
  inside until the dialog closes (see the APG dialog pattern).
- **Hover content also works on focus.** A tooltip, a menu or a preview opens on
  `:focus-visible` as well as on hover, and closes with `Escape` (1.4.13). Use
  `focus-within` on the container and `focus-visible` on the control.
- **Never hide what the keyboard needs** with `display: none`. Hide it visually
  with `opacity-0` and show it on focus.
- **Targets are at least 24 by 24 CSS pixels** (2.5.8). Small icon buttons get
  padding or a larger hit area.
- **Single-pointer actions** have an alternative that does not need a drag (2.5.7),
  such as a button for a drag and drop.

## 5. Patterns of the APG

Use the pattern of the APG for each kind of widget. Base UI already implements
the keyboard and the focus of its components (menu, tabs, select, slider,
dialog); use them and check the behaviour the component gives. When a widget is
built from elements, implement the APG pattern in full.

- **Button**: `Enter` and `Space` activate it. A toggle button has `aria-pressed`.
- **Dialog (modal)**: `role="dialog"` with `aria-modal`, a name from its title
  (`aria-labelledby`), the focus moves inside when it opens, `Tab` stays inside,
  `Escape` closes it, and the focus returns to the trigger when it closes.
  The `Dialog` of the UI lib does this; the rules for its content are in
  [dialogs](../design/dialogs.md).
- **Menu and menu button**: `aria-haspopup`, `aria-expanded`, the arrow keys move
  between items, `Escape` closes and returns the focus.
- **Tabs**: one tab in the tab order, the arrow keys change the tab, `aria-selected`
  and `aria-controls` link each tab to its panel.
- **Slider**: `role="slider"` (native `input type="range"` when possible), a
  name, and `aria-valuetext` readable by people (`getThumbValueText` in the UI lib).
- **Listbox and select**: the options are `role="option"` inside a `listbox`, with
  `aria-selected`, and the arrow keys move between them.
- **Accordion**: a `button` with `aria-expanded` controls each panel.
- **Tooltip**: opens on hover and on focus, closes with `Escape`, and its content
  stays while the pointer is over it (1.4.13).

## 6. Messages, state and loading

- **Status messages** are announced without moving the focus: `role="status"` for
  a result (a saved item, a count), `role="alert"` for an error that needs
  attention now (4.1.3). The toast and the form error of the libs already use them.
- **Errors in forms** say what is wrong, in text (3.3.1), next to the field, and
  the first invalid field receives the focus on submit. An error is never shown
  only by colour.
- **Loading** has a text the screen reader can read (`role="status"`), and a
  region being replaced gets `aria-busy="true"` while it loads.
- **Autocomplete** is set on the fields of personal data (1.3.5), such as `name`,
  `email` and `tel`.

## 7. Colour, contrast and motion

- **Text contrast is at least 4.5 to 1**, and large text (24 px, or 18.66 px in
  bold) is at least 3 to 1 (1.4.3).
- **Borders of inputs, icons that carry meaning and the focus ring are at least
  3 to 1** against the background (1.4.11).
- **Colour is never the only signal** (1.4.1): an error, a selected state and a
  required field also have text or an icon.
- **The theme tokens are checked in every theme.** A token that passes in one
  theme and fails in another is a bug of the theme, not of the component.
- **Motion**: content that moves on its own for more than five seconds (a
  carousel, a slideshow) has a pause control (2.2.2). Respect
  `prefers-reduced-motion` on animations that move large areas.
- **Flashing**: nothing flashes more than three times a second (2.3.1).

## 8. Zoom and reflow

- The page works with the text zoomed to 200% (1.4.4) and at 320 CSS pixels wide
  without horizontal scrolling (1.4.10). The layout uses the classes that wrap.

## 9. Testing

- Test the keyboard by hand: `Tab`, `Shift+Tab`, `Enter`, `Space`, the arrow keys
  and `Escape` on each new control.
- Run an automated check of the page (the `browser-tester` agent reports the
  accessibility basics in a real browser). An automated check finds part of the
  problems; the keyboard and a screen reader find the rest.

## Don'ts

- Don't use a `div` or `span` with `onClick` for a control.
- Don't put a `role` on an element to silence a lint rule.
- Don't use `role="application"` on a page or a widget that the user browses
  with the keyboard: it turns off the screen reader's own navigation. Use the
  pattern of the APG for the widget instead.
- Don't use a `tabIndex` greater than 0.
- Don't remove the focus ring without a visible replacement.
- Don't write an `aria-label` that repeats a visible text the element already has,
  or that differs from it.
- Don't use `title` as the only name of a control or an image.
