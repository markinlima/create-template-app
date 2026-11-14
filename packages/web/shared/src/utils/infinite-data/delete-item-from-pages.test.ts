import { describe, expect, it } from "bun:test";

import { QueryClient } from "@tanstack/react-query";

import { deleteItemFromPages } from "./delete-item-from-pages";

interface Item {
  id: string;
}

const makeItem = (id: string): Item => ({ id });

const feedKey = [
  "Post",
  { operationId: "feed", paginationType: "cursor", dataShape: "dto" },
];
const otherFeedKey = [
  "Post",
  { operationId: "other-feed", paginationType: "cursor", dataShape: "dto" },
];
const listKey = [
  "Post",
  { operationId: "list", paginationType: "full", dataShape: "dto" },
];
const singleKey = [
  "Post",
  { operationId: "get-post", paginationType: "none", dataShape: "dto" },
];

function setup() {
  const queryClient = new QueryClient();
  const pages = () => ({
    pages: [
      {
        items: [makeItem("a"), makeItem("b"), makeItem("c")],
        meta: { next: "1" },
      },
      { items: [makeItem("d"), makeItem("a")], meta: { next: "2" } },
    ],
    pageParams: [],
  });

  queryClient.setQueryData(feedKey, pages());
  queryClient.setQueryData(otherFeedKey, pages());
  queryClient.setQueryData(listKey, { items: [makeItem("a"), makeItem("b")] });
  queryClient.setQueryData(singleKey, makeItem("a"));

  return queryClient;
}

function idsOfPages(queryClient: QueryClient, key: unknown[]) {
  return queryClient
    .getQueryData<{ pages: { items: Item[] }[] }>(key)
    ?.pages.map((page) => page.items.map((item) => item.id));
}

describe("deleteItemFromPages", () => {
  it("takes only the item out of its page, keeping the rest of the page", () => {
    const queryClient = setup();

    deleteItemFromPages<Item>({
      queryClient,
      queryKey: ["Post"],
      where: (item) => item.id === "b",
    });

    expect(idsOfPages(queryClient, feedKey)).toEqual([
      ["a", "c"],
      ["d", "a"],
    ]);
  });

  it("keeps every page, and its cursor, even when the page is left empty", () => {
    const queryClient = setup();

    deleteItemFromPages<Item>({
      queryClient,
      queryKey: ["Post"],
      where: (item) => item.id === "d",
    });
    deleteItemFromPages<Item>({
      queryClient,
      queryKey: ["Post"],
      where: (item) => item.id === "a",
      stopAfterFirstMatch: false,
    });

    const data = queryClient.getQueryData<{
      pages: { meta: { next: string } }[];
    }>(feedKey);

    expect(data?.pages.map((page) => page.meta.next)).toEqual(["1", "2"]);
  });

  it("takes out only the first match by default", () => {
    const queryClient = setup();

    deleteItemFromPages<Item>({
      queryClient,
      queryKey: ["Post"],
      where: (item) => item.id === "a",
    });

    expect(idsOfPages(queryClient, feedKey)).toEqual([
      ["b", "c"],
      ["d", "a"],
    ]);
  });

  it("takes out every match when asked to", () => {
    const queryClient = setup();

    deleteItemFromPages<Item>({
      queryClient,
      queryKey: ["Post"],
      where: (item) => item.id === "a",
      stopAfterFirstMatch: false,
    });

    expect(idsOfPages(queryClient, feedKey)).toEqual([["b", "c"], ["d"]]);
  });

  it("only touches the queries the key narrows it down to", () => {
    const queryClient = setup();

    deleteItemFromPages<Item>({
      queryClient,
      queryKey: ["Post", { operationId: "feed" }],
      where: (item) => item.id === "b",
    });

    expect(idsOfPages(queryClient, feedKey)).toEqual([
      ["a", "c"],
      ["d", "a"],
    ]);
    expect(idsOfPages(queryClient, otherFeedKey)).toEqual([
      ["a", "b", "c"],
      ["d", "a"],
    ]);
  });

  it("also takes the item out of plain lists", () => {
    const queryClient = setup();

    deleteItemFromPages<Item>({
      queryClient,
      queryKey: ["Post"],
      where: (item) => item.id === "a",
    });

    expect(
      queryClient
        .getQueryData<{ items: Item[] }>(listKey)
        ?.items.map((item) => item.id),
    ).toEqual(["b"]);
  });

  it("forgets a single item query that is the item", () => {
    const queryClient = setup();

    deleteItemFromPages<Item>({
      queryClient,
      queryKey: ["Post"],
      where: (item) => item.id === "a",
    });

    expect(queryClient.getQueryData(singleKey)).toBeUndefined();
  });

  it("ignores a cursor query whose data is not infinite", () => {
    const queryClient = setup();
    const notInfiniteKey = [
      "Post",
      {
        operationId: "not-infinite",
        paginationType: "cursor",
        dataShape: "dto",
      },
    ];
    queryClient.setQueryData(notInfiniteKey, makeItem("a"));

    expect(() =>
      deleteItemFromPages<Item>({
        queryClient,
        queryKey: ["Post"],
        where: (item) => item.id === "a",
      }),
    ).not.toThrow();
  });
});
