import type { PublicFile } from "../../types/public-file";
import { matchesEtag } from "./matches-etag";
import { pickVariant } from "./pick-variant";

/** Options of {@link respondWithFile}. */
export interface RespondWithFileOptions {
  file: PublicFile;
  request: Request;
}

/** Answers a request for a file of the build: the variant the client takes, or a `304` when it already has it. */
export function respondWithFile({ file, request }: RespondWithFileOptions) {
  const variant = pickVariant(file, request.headers.get("accept-encoding"));

  if (matchesEtag(request.headers.get("if-none-match"), variant.etag)) {
    return new Response(null, variant.notModifiedInit);
  }

  return new Response(variant.body, variant.init);
}
