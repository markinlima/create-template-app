import {
  emptyStringsToUndefined,
  stringsToBoolean,
  trimStrings,
} from "@shared/utils";

export function formatEnvVariables(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  if (typeof obj !== "object") {
    throw new Error("Input must be a object");
  }

  // trim first so whitespace-only values also count as empty
  const trimmedObj = trimStrings(obj);
  const emptyStringsToUndefinedObj = emptyStringsToUndefined(trimmedObj);
  const stringsToBooleanObj = stringsToBoolean(emptyStringsToUndefinedObj);
  return stringsToBooleanObj;
}
