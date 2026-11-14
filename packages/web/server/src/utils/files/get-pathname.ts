/** The path of a request URL, without the query, the hash or a trailing slash (`/about-us/?a=1` is `/about-us`; the root stays `/`). */
export function getPathname(url: string) {
  const schemeEnd = url.indexOf("://");
  const pathStart = schemeEnd === -1 ? 0 : url.indexOf("/", schemeEnd + 3);
  const rest = pathStart === -1 ? "/" : url.slice(pathStart);
  const end = rest.search(/[?#]/);
  const pathname = end === -1 ? rest : rest.slice(0, end);

  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname || "/";
}
