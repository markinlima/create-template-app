import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "bun:test";

import type { ProjectConfig } from "../types/project-config";
import { findTestProjects } from "./find-test-projects";

let root = "";

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

function project(id: string, folder: string): ProjectConfig {
  return { id, name: id, description: "", path: folder };
}

describe("findTestProjects", () => {
  it("keeps, in the order of the config, only the projects that have a test compose file", async () => {
    root = await mkdtemp(path.join(tmpdir(), "find-test-projects-"));

    const projects = [
      project("web", "apps/web"),
      project("worker", "workers/mailer"),
      project("backend", "apps/backend"),
      project("docs", "apps/docs"),
    ];

    for (const folder of [
      "apps/web",
      "apps/backend",
      "apps/docs",
      "workers/mailer",
    ]) {
      await mkdir(path.join(root, folder), { recursive: true });
    }

    await Bun.write(path.join(root, "apps/web/docker-compose.test.yml"), "");
    await Bun.write(
      path.join(root, "workers/mailer/docker-compose.test.yml"),
      "",
    );
    await Bun.write(
      path.join(root, "apps/backend/docker-compose.test.yml"),
      "",
    );

    const found = await findTestProjects(projects, root);

    expect(found.map((item) => item.id)).toEqual(["web", "worker", "backend"]);
  });
});
