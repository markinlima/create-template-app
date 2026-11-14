/** Marks a Zod schema as a named component of the OpenAPI document (`#/components/schemas/<name>`), so routes can reference it by name. */
export function ref<T extends string>(ref: T) {
  return { $ref: `#/components/schemas/${ref}` as const, description: ref };
}
