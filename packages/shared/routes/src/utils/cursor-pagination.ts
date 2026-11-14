/** The `meta` of a cursor-paginated response. `nextCursor` is the cursor of the next page, `null` on the last one. */
export interface CursorPaginationMeta<Cursor = string> {
  nextCursor: Cursor | null;
}
