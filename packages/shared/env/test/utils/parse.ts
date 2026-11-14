import type { ZodType } from "zod";

/**
 * Parses `input` and returns the unique, sorted dotted paths of every failed
 * variable (composed schemas can report the same variable more than once).
 */
export function failedKeys(schema: ZodType, input: unknown) {
  const result = schema.safeParse(input);

  if (result.success) {
    return [];
  }

  const paths = result.error.issues.map((issue) => issue.path.join("."));

  return [...new Set(paths)].sort();
}
