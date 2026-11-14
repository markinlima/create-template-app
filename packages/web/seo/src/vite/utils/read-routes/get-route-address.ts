/**
 * The address of a route as the browser sees it: the pathless groups (`_landing-pages`, `_redirect`) are not in the URL, and neither is the
 * trailing slash. A route with a parameter (`$postId`) has no single address, so it can't be written as a static page.
 */
export function getRouteAddress(routePath: string) {
  const segments = routePath
    .split("/")
    .filter((segment) => segment !== "" && !segment.startsWith("_"));

  if (segments.some((segment) => segment.startsWith("$"))) {
    throw new Error(
      `The route ${routePath} has a parameter, so it has no static address.`,
    );
  }

  return `/${segments.join("/")}`;
}
