export const GLOBAL_MENTION_REGEX =
  /<@([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})>/g;

export function extractMentionIds(input: string): string[] {
  return [...input.matchAll(GLOBAL_MENTION_REGEX)]
    .map((match) => match[1])
    .filter((v): v is string => !!v);
}

export interface MentionPart {
  isMention: boolean;
  content: string;
}

export function parseMentions(input: string): MentionPart[] {
  const parts: MentionPart[] = [];
  let lastIndex = 0;

  for (const match of input.matchAll(GLOBAL_MENTION_REGEX)) {
    const [mention] = match;
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push({
        isMention: false,
        content: input.slice(lastIndex, start),
      });
    }

    parts.push({
      isMention: true,
      content: mention.replace(/<@|>/g, ""),
    });

    lastIndex = start + mention.length;
  }

  if (lastIndex < input.length) {
    parts.push({
      isMention: false,
      content: input.slice(lastIndex),
    });
  }

  return parts;
}

export interface ReplaceMentionsOptions {
  replacer: (id: string) => string | null | undefined;
  fallback?: string;
}

export function replaceMentions(
  input: string,
  { replacer, fallback = "Desconhecido" }: ReplaceMentionsOptions,
) {
  return input.replace(GLOBAL_MENTION_REGEX, (_match, id) => {
    return replacer(id) ?? fallback;
  });
}

/**
 * Removes the <@ > format from the input string, leaving only the text content.
 */
export function clearMention(input: string) {
  return input.replace(GLOBAL_MENTION_REGEX, (_match, id) => id);
}

/** Removes every mention (`<@id>`) from the input, leaving only the text the user typed. */
export function removeMentions(input: string) {
  return input.replace(GLOBAL_MENTION_REGEX, "");
}

/** How many mentions (`<@id>`) the input has, repeated ones included. */
export function countMentions(input: string) {
  return [...input.matchAll(GLOBAL_MENTION_REGEX)].length;
}
