import z from "zod";

export const booleanEnum = z.enum(["true", "false"]);

export interface StringToBooleanOptions {
  asEnum?: boolean;
}

export function stringToBoolean({
  asEnum = false,
}: StringToBooleanOptions = {}) {
  if (asEnum) {
    return booleanEnum.transform((v) => v === "true");
  }

  return z
    .string()
    .toLowerCase()
    .transform((v) => v === "true");
}

export type BooleanEnum = z.infer<typeof booleanEnum>;
