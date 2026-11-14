import projectsFile from "../../../projects.json" with { type: "json" };
import type { Project } from "../types/project";
import type { ProjectConfig } from "../types/project-config";

/** Every project of `projects.json` (apps and workers), in the order of the file. */
export const PROJECT_CONFIG: ProjectConfig[] = projectsFile.projects;

/** The projects the setup can start, each one under the Compose profile of its id. */
export const PROJECTS: Project[] = PROJECT_CONFIG.map((project) => ({
  name: project.name,
  value: project.id,
  description: project.description,
}));

/**
 * What only helps to look at what the apps send (telemetry, errors). No app and no test depends on them, and they have a profile
 * of their own in the services compose file.
 */
export const EXTRAS: Project[] = [
  {
    name: "Monitoramento",
    value: "monitoring",
    description:
      "Extra: OpenObserve (traces, métricas e logs) e Rustrak (erros, compatível com o Sentry)",
  },
];

/** The profile that turns on every service of the services compose file. */
export const SERVICES_PROFILE = "services";

/** The shared network of the dev stack, where the dev container and the services meet. */
export const DEV_NETWORK = "development-net";
