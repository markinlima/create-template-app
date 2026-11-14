import type { HeadTags } from "../../types/head";
import { escapeRegExp } from "../strings/escape-reg-exp";
import { getMetaKey } from "./get-meta-key";

/** Takes out the tags the page already has for what is about to be added, so the crawler never sees the same tag twice. */
export function removeExistingTags(html: string, { meta, links }: HeadTags) {
  let result = html;

  for (const key of new Set(meta.map(getMetaKey))) {
    if (key === "title") {
      result = result.replace(/<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, "");
      continue;
    }

    const [attribute, value] = key.split(/:(.*)/s);
    const pattern = new RegExp(
      `<meta\\b[^>]*\\b${attribute}\\s*=\\s*["']${escapeRegExp(value ?? "")}["'][^>]*>\\s*`,
      "gi",
    );

    result = result.replace(pattern, "");
  }

  for (const rel of new Set(links.map((link) => link.rel))) {
    result = result.replace(
      new RegExp(
        `<link\\b[^>]*\\brel\\s*=\\s*["']${escapeRegExp(rel)}["'][^>]*>\\s*`,
        "gi",
      ),
      "",
    );
  }

  return result;
}
