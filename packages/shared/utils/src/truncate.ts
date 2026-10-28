export interface TruncateOptions {
  length: number;
  ellipsis?: string;
}

export function truncate(
  text: string,
  { length, ellipsis = "..." }: TruncateOptions,
) {
  if (text.length <= length) {
    return text;
  }
  return text.slice(0, length - ellipsis.length) + ellipsis;
}
