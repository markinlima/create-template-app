import { z } from "zod";

export function nodeEnv() {
  return z
    .custom<"development" | "staging" | "test" | "production" | (string & {})>(
      (v) => typeof v === "string",
    )
    .default("production");
}
