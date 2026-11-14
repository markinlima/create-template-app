import { $ } from "bun";

import { CONTAINER_WORKDIR } from "../../constants/container-workdir";

// NOTE: the files are copied into the container instead of bind-mounted. A mount needs the path to exist on the Docker host,
// NOTE: which is not the case under act or in the dev container (Docker outside of Docker): the tool would see an empty folder.

export interface RunWithFilesOptions {
  image: string;
  args: string[];
  /** Paths of the checkout to copy, relative to the current directory. They land under CONTAINER_WORKDIR. */
  paths: string[];
}

export interface RunWithFilesResult {
  exitCode: number;
  /** stdout followed by stderr, already printed. */
  output: string;
}

/**
 * Runs a tool image on files of the checkout and removes the container afterwards.
 *
 * @param options - See {@link RunWithFilesOptions}.
 * @returns The exit code and the output of the tool.
 */
export async function runWithFiles(options: RunWithFilesOptions) {
  const container = (
    await $`docker create -w ${CONTAINER_WORKDIR} ${options.image} ${options.args}`.text()
  ).trim();
  try {
    await $`tar -c --owner=0 --group=0 --transform=${`s,^,${CONTAINER_WORKDIR.slice(1)}/,`} ${options.paths} | docker cp - ${`${container}:/`}`.quiet();
    const result = await $`docker start -a ${container}`.nothrow().quiet();
    const output = `${result.stdout}${result.stderr}`;
    console.log(output);
    return { exitCode: result.exitCode, output } satisfies RunWithFilesResult;
  } finally {
    await $`docker rm -f ${container}`.nothrow().quiet();
  }
}
