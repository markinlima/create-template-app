export interface Args {
  flags: Set<string>;
  values: Map<string, string>;
}

/** `--name value` pairs and `--flag`s, from the arguments after the script's name. A name listed in `withValue` takes the next argument. */
export function parseArgs(argv: string[], withValue: string[]): Args {
  const flags = new Set<string>();
  const values = new Map<string, string>();

  for (let position = 0; position < argv.length; position++) {
    const argument = argv[position] ?? "";

    if (!argument.startsWith("--")) {
      continue;
    }

    const name = argument.slice(2);

    if (withValue.includes(name)) {
      values.set(name, argv[position + 1] ?? "");
      position++;
    } else {
      flags.add(name);
    }
  }

  return { flags, values };
}
