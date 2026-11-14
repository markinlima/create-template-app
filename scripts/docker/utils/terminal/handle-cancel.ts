import * as p from "@clack/prompts";

/**
 * Ends the script when the user cancels a prompt (Ctrl+C), and tells TypeScript the value is a real answer after it.
 *
 * @param value - What the prompt gave back.
 */
export function handleCancel<T>(value: T): asserts value is Exclude<T, symbol> {
  if (p.isCancel(value)) {
    p.cancel("Operação cancelada pelo usuário.");
    process.exit(0);
  }
}
