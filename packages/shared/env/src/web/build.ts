import z from "zod";

import { formatEnvVariables } from "../utils";
import { webEnvSource } from "./source";

/** Every web variable, for the Vite config at build time (it also reads the build-only ones). */
export const buildEnvSchema = z.preprocess(formatEnvVariables, webEnvSource);
