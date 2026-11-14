import { CiError } from "./ci-error";

/** Returns the value of an environment variable, or fails with a message that names it. */
export function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new CiError(`The ${name} environment variable is required.`);
  }
  return value;
}
