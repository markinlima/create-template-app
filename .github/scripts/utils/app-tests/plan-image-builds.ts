import { isAbsolute, join } from "node:path";

import type { ComposeBuild, ComposeConfig } from "../../types/compose-config";
import type { ImageBuild } from "../../types/image-build";

/**
 * Turns the resolved compose config into one `docker build` per service that has a `build` section.
 *
 * @param config - The resolved compose file (see {@link ComposeConfig}).
 * @returns The builds, sorted by service name.
 * @throws {Error} When a build secret has no file.
 */
export function planImageBuilds(config: ComposeConfig): ImageBuild[] {
  return Object.entries(config.services)
    .filter(([, service]) => !!service.build)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, service]) => {
      const build = service.build as ComposeBuild;
      // NOTE: compose names an image without `image:` after the project and the service.
      const image = service.image ?? `${config.name}-${name}`;
      const dockerfile = build.dockerfile ?? "Dockerfile";
      const args = [
        "build",
        "--tag",
        image,
        "--file",
        isAbsolute(dockerfile) ? dockerfile : join(build.context, dockerfile),
      ];

      if (build.target) {
        args.push("--target", build.target);
      }
      if (build.pull) {
        args.push("--pull");
      }
      for (const [key, value] of Object.entries(build.args ?? {})) {
        args.push("--build-arg", value === null ? key : `${key}=${value}`);
      }
      for (const secret of build.secrets ?? []) {
        const file = config.secrets?.[secret.source]?.file;
        if (!file) {
          throw new Error(
            `Secret '${secret.source}' of service '${name}' has no file.`,
          );
        }
        args.push(
          "--secret",
          `id=${secret.target ?? secret.source},src=${file}`,
        );
      }
      args.push(build.context);
      return { service: name, image, args };
    });
}
