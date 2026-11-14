import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import { createSeo } from "../create-seo";
import { TEST_SITE } from "../test/site";
import { prerenderStaticPages } from "./prerender-static-pages";

const SHELL = `<!doctype html><html><head><meta charset="utf-8" /></head><body><div id="root"></div></body></html>`;
const seo = createSeo(TEST_SITE);

let workspace = "";
let outDir = "";
let routesDirectory = "";

beforeEach(async () => {
  workspace = await mkdtemp(path.join(os.tmpdir(), "seo-prerender-"));
  outDir = path.join(workspace, "build");
  routesDirectory = path.join(workspace, "routes");

  await mkdir(outDir, { recursive: true });
  await mkdir(path.join(routesDirectory, "_landing-pages", "about-us"), {
    recursive: true,
  });
  await mkdir(path.join(routesDirectory, "app", "_private", "feed"), {
    recursive: true,
  });

  await writeFile(path.join(outDir, "index.html"), SHELL);
  await writeFile(
    path.join(routesDirectory, "_landing-pages", "about-us", "index.tsx"),
    `export const Route = createFileRoute("/_landing-pages/about-us/")({ staticData: { seo: { title: "Sobre nós", description: "Quem somos." }, prerender: true } });`,
  );
  await writeFile(
    path.join(routesDirectory, "app", "_private", "feed", "index.tsx"),
    `export const Route = createFileRoute("/app/_private/feed/")({ component: null });`,
  );
});

afterEach(async () => {
  await rm(workspace, { recursive: true, force: true });
});

describe("prerenderStaticPages", () => {
  it("writes the tags of the site into index.html and the page into its address folder", async () => {
    const written = await prerenderStaticPages({
      seo,
      siteUrl: "https://site.test",
      outDir,
      routesDirectory,
    });

    expect(written).toEqual(["/about-us"]);

    const home = await readFile(path.join(outDir, "index.html"), "utf8");
    expect(home).toContain(`<title data-seo-tag>${TEST_SITE.title}</title>`);

    const about = await readFile(
      path.join(outDir, "about-us", "index.html"),
      "utf8",
    );
    expect(about).toContain(
      "<title data-seo-tag>Sobre nós | Example App</title>",
    );
    expect(about).toContain(
      `<link data-seo-tag rel="canonical" href="https://site.test/about-us" />`,
    );
  });

  it("writes a sitemap with the home page and the static pages", async () => {
    await prerenderStaticPages({
      seo,
      siteUrl: "https://site.test",
      outDir,
      routesDirectory,
    });

    const sitemap = await readFile(path.join(outDir, "sitemap.xml"), "utf8");

    expect(sitemap).toContain("<loc>https://site.test/</loc>");
    expect(sitemap).toContain("<loc>https://site.test/about-us</loc>");
    expect(sitemap).not.toContain("/app/feed");
  });

  it("leaves out of the pages a route that has seo but does not ask to be prerendered", async () => {
    await writeFile(
      path.join(routesDirectory, "app", "_private", "feed", "index.tsx"),
      `export const Route = createFileRoute("/app/_private/feed/")({ staticData: { seo: { title: "Feed" } } });`,
    );

    const written = await prerenderStaticPages({
      seo,
      siteUrl: "https://site.test",
      outDir,
      routesDirectory,
    });

    expect(written).toEqual(["/about-us"]);
  });

  it("writes a page that asks not to be indexed, but leaves it out of the sitemap", async () => {
    await mkdir(path.join(routesDirectory, "auth", "login"), {
      recursive: true,
    });
    await writeFile(
      path.join(routesDirectory, "auth", "login", "index.tsx"),
      `export const Route = createFileRoute("/auth/login/")({ staticData: { seo: { title: "Entrar", noIndex: true }, prerender: true } });`,
    );

    await prerenderStaticPages({
      seo,
      siteUrl: "https://site.test",
      outDir,
      routesDirectory,
    });

    const login = await readFile(
      path.join(outDir, "auth", "login", "index.html"),
      "utf8",
    );
    const sitemap = await readFile(path.join(outDir, "sitemap.xml"), "utf8");

    expect(login).toContain(`content="noindex, nofollow"`);
    expect(sitemap).toContain("<loc>https://site.test/about-us</loc>");
    expect(sitemap).not.toContain("/auth/login");
  });

  it("refuses to run on an index.html that already has the tags, so a second run can't double them", async () => {
    await prerenderStaticPages({
      seo,
      siteUrl: "https://site.test",
      outDir,
      routesDirectory,
    });

    await expect(
      prerenderStaticPages({
        seo,
        siteUrl: "https://site.test",
        outDir,
        routesDirectory,
      }),
    ).rejects.toThrow("already has the tags");
  });

  it("refuses two routes with the same address", async () => {
    await mkdir(path.join(routesDirectory, "_landing-pages", "about-us-copy"), {
      recursive: true,
    });
    await writeFile(
      path.join(
        routesDirectory,
        "_landing-pages",
        "about-us-copy",
        "index.tsx",
      ),
      `export const Route = createFileRoute("/_landing-pages/about-us/")({ staticData: { seo: { title: "Cópia" }, prerender: true } });`,
    );

    await expect(
      prerenderStaticPages({
        seo,
        siteUrl: "https://site.test",
        outDir,
        routesDirectory,
      }),
    ).rejects.toThrow("Two routes declare the static page /about-us");
  });
});
