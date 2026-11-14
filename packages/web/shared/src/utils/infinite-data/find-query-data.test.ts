import { describe, expect, it } from "bun:test";

import { QueryClient } from "@tanstack/react-query";

import { findQueryData } from "./find-query-data";

interface Item {
  id: string;
}

describe("findQueryData", () => {
  it("finds an item in a page of a feed", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["Comment", { operationId: "feed" }], {
      pages: [{ items: [{ id: "a" }] }, { items: [{ id: "b" }] }],
      pageParams: [],
    });

    const found = findQueryData<Item>({
      queryClient,
      queryKey: ["Comment"],
      where: (item) => item.id === "b",
    });

    expect(found).toEqual({ id: "b" });
  });

  it("finds an item in a list and in a single item cache", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["Comment", { operationId: "list" }], {
      items: [{ id: "a" }],
    });
    queryClient.setQueryData(["Comment", { operationId: "get" }], { id: "c" });

    expect(
      findQueryData<Item>({
        queryClient,
        queryKey: ["Comment"],
        where: (item) => item.id === "a",
      }),
    ).toEqual({ id: "a" });
    expect(
      findQueryData<Item>({
        queryClient,
        queryKey: ["Comment"],
        where: (item) => item.id === "c",
      }),
    ).toEqual({ id: "c" });
  });

  it("returns nothing when no cache has the item", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["Comment", { operationId: "feed" }], {
      pages: [{ items: [{ id: "a" }] }],
      pageParams: [],
    });

    expect(
      findQueryData<Item>({
        queryClient,
        queryKey: ["Comment"],
        where: (item) => item.id === "zzz",
      }),
    ).toBeUndefined();
    expect(
      findQueryData<Item>({
        queryClient,
        queryKey: ["Post"],
        where: () => true,
      }),
    ).toBeUndefined();
  });
});
