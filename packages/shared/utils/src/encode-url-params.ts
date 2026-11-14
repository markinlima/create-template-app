const urlTemplate = /(url: `)([^`]*)(`)/g;
const plainParam = /\$\{(\w+)\}/g;

/**
 * Wraps the path params that generated API clients interpolate into their
 * `url: \`...\`` templates with `encodeURIComponent`, so a param holding `/`,
 * `..` or `?` can't change the path that is requested. Only plain
 * `${identifier}` params inside `url` templates are touched, which also makes
 * running it twice harmless.
 */
export function encodeUrlParams(source: string) {
  return source.replace(
    urlTemplate,
    (_, start: string, template: string, end: string) =>
      `${start}${template.replace(plainParam, "${encodeURIComponent(String($1))}")}${end}`,
  );
}
