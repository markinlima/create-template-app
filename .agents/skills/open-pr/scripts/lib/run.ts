export interface RunOptions {
  cwd?: string;
  /** Written to the standard input of the command. */
  input?: string;
  env?: Record<string, string>;
}

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

/** Runs a command and waits for it. It never throws: the caller reads `code`. */
export function run(command: string[], options: RunOptions = {}): RunResult {
  const result = Bun.spawnSync(command, {
    cwd: options.cwd,
    stdin: options.input === undefined ? "ignore" : Buffer.from(options.input),
    env: { ...process.env, ...options.env },
    stdout: "pipe",
    stderr: "pipe",
  });

  return {
    code: result.exitCode,
    stdout: result.stdout.toString(),
    stderr: result.stderr.toString(),
  };
}

/**
 * Runs git with literal pathspecs: a path like `routes/[postId].ts` or `src/$id.tsx` is that file, not a glob (`[postId]` would
 * match one letter of the set).
 */
export function git(args: string[], options: RunOptions = {}) {
  return run(["git", ...args], {
    ...options,
    env: { GIT_LITERAL_PATHSPECS: "1", ...options.env },
  });
}

/** Like `git`, but a failure is an error that carries what git said. */
export function gitOrThrow(args: string[], options: RunOptions = {}) {
  const result = git(args, options);

  if (result.code !== 0) {
    const reason = result.stderr.trim() || result.stdout.trim();

    throw new Error(`git ${args.join(" ")} failed: ${reason}`);
  }

  return result.stdout;
}
