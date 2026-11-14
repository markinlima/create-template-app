const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Makes a text safe to put in the content of an element or in a quoted attribute. The content of a post is written by users. */
export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) => ENTITIES[character] ?? character,
  );
}
