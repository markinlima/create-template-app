import { describe, expect, it } from "bun:test";

import { readPrerenderPage } from "./read-prerender-page";

const route = (staticData: string, routePath = "/_landing-pages/about-us/") => `
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("${routePath}")({
  ${staticData}
  component: RouteComponent,
});

function RouteComponent() {
  return null;
}
`;

describe("readPrerenderPage", () => {
  it("reads the seo and the address of a route that asks to be prerendered", () => {
    const result = readPrerenderPage({
      source: route(
        `staticData: { seo: { title: "Sobre nós", description: "Quem somos." }, prerender: true },`,
      ),
      filename: "route.tsx",
    });

    expect(result).toEqual({
      address: "/about-us",
      page: { title: "Sobre nós", description: "Quem somos." },
    });
  });

  it("gives nothing for a route that has seo but does not ask to be prerendered", () => {
    expect(
      readPrerenderPage({
        source: route(`staticData: { seo: { title: "Seguindo" } },`),
        filename: "route.tsx",
      }),
    ).toBeUndefined();
    expect(
      readPrerenderPage({
        source: route(
          `staticData: { seo: { title: "Seguindo" }, prerender: false },`,
        ),
        filename: "route.tsx",
      }),
    ).toBeUndefined();
  });

  it("gives nothing for a route that has no static data", () => {
    expect(
      readPrerenderPage({ source: route(""), filename: "route.tsx" }),
    ).toBeUndefined();
    expect(
      readPrerenderPage({
        source: route("staticData: { other: 1 },"),
        filename: "route.tsx",
      }),
    ).toBeUndefined();
  });

  it("refuses a route that asks to be prerendered without saying its seo", () => {
    expect(() =>
      readPrerenderPage({
        source: route("staticData: { prerender: true },"),
        filename: "route.tsx",
      }),
    ).toThrow("has no seo");
  });

  it("refuses a prerender that is not true or false, so the page is never written from a guess", () => {
    expect(() =>
      readPrerenderPage({
        source: route(
          `staticData: { seo: { title: "Sobre" }, prerender: SHOULD },`,
        ),
        filename: "route.tsx",
      }),
    ).toThrow("only say literal values");
    expect(() =>
      readPrerenderPage({
        source: route(`staticData: { seo: { title: "Sobre" }, prerender: 1 },`),
        filename: "route.tsx",
      }),
    ).toThrow("is not valid");
  });

  it("refuses a route with a parameter, which has no single address to write", () => {
    expect(() =>
      readPrerenderPage({
        source: route(
          `staticData: { seo: { title: "Perfil" }, prerender: true },`,
          "/_landing-pages/profile/$username/",
        ),
        filename: "route.tsx",
      }),
    ).toThrow("has a parameter");
  });

  it("refuses a seo that needs code", () => {
    expect(() =>
      readPrerenderPage({
        source: route(
          "staticData: { seo: { title: TITULO }, prerender: true },",
        ),
        filename: "route.tsx",
      }),
    ).toThrow("only say literal values");
  });

  it("refuses a seo without a title", () => {
    expect(() =>
      readPrerenderPage({
        source: route(
          `staticData: { seo: { description: "Sem título." }, prerender: true },`,
        ),
        filename: "route.tsx",
      }),
    ).toThrow("is not valid");
  });

  it("reads a route in a .ts file too", () => {
    const result = readPrerenderPage({
      source: route(
        `staticData: { seo: { title: "Termos" }, prerender: true },`,
        "/_landing-pages/policies/terms-of-use/",
      ),
      filename: "route.ts",
    });

    expect(result?.address).toBe("/policies/terms-of-use");
  });
});
