/** `undefined` for a `GET` or `HEAD`, the `405` for anything else. */
export function rejectUnlessReadMethod(request: Request) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  return new Response("Method not allowed", {
    status: 405,
    headers: { Allow: "GET, HEAD" },
  });
}
