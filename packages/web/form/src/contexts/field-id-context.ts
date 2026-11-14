import { createContext } from "react";

/**
 * Unique id of the field rendered by `Field`. The control, its label and its error use it to link to each other.
 * `null` outside a `Field`.
 */
export const FieldIdContext = createContext<string | null>(null);
