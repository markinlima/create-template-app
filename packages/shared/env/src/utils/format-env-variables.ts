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

  const emptyStringsToUndefinedObj = emptyStringsToUndefined(obj);
  const sanitizedTrimObj = trimStrings(emptyStringsToUndefinedObj);
  const stringsToBooleanObj = stringsToBoolean(sanitizedTrimObj);
  return stringsToBooleanObj;
}
