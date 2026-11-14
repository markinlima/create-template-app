/** A request the page really makes, which blockers cut by address (an analytics or an error report endpoint). */
export interface RequestProbe {
  /** Address of the request, with the query string the real code sends. */
  url: string;
  /**
   * Method of the real request.
   * @defaultValue "GET"
   */
  method?: "GET" | "POST";
}
