/** Returns the value of an environment variable, or undefined when it is missing or empty. */
export function optionalEnv(name: string) {
  return process.env[name] || undefined;
}
