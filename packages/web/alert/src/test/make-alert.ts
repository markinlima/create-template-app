import type { AlertItem } from "../types/alert-item";
import type {
  AlertContentBase,
  AlertImportance,
} from "../types/content/alert-content";

export function makeAlert(
  id: string,
  importance: AlertImportance = "low",
): AlertItem<AlertContentBase> {
  return { id, content: { type: "markdown", importance, title: id } };
}
