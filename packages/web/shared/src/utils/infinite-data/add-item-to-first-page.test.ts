import { describe, expect, it } from "bun:test";

import { QueryClient } from "@tanstack/react-query";

import { addItemToFirstPage } from "./add-item-to-first-page";

interface Item {
  id: string;
}

const item = (id: string): Item => ({ id });
const base = {
  operationId: "list-user-collections",
  paginationType: "cursor",
  dataShape: "dto",
};

const infiniteKey = ["Collection", { ...base, isInfinite: true, userId: "u1" }];
const previewKey = [
  "Collection",
  { ...base, isInfinite: false, userId: "u1", limit: 4 },
];
const otherUserKey = [
  "Collection",
  { ...base, isInfinite: true, userId: "u2" },
];

function setup() {
  const queryClient = new QueryClient();
  queryClient.setQueryData(infiniteKey, {
    pages: [{ items: [item("1")], meta: {} }],
    pageParams: [undefined],
  });
  queryClient.setQueryData(previewKey, {
    items: [item("1"), item("2"), item("3"), item("4")],
    meta: {},
  });
  queryClient.setQueryData(otherUserKey, {
    pages: [{ items: [item("9")], meta: {} }],
    pageParams: [undefined],
  });
  return queryClient;
}

function add(queryClient: QueryClient) {
  addItemToFirstPage<Item>({
    queryClient,
    queryKey: [
      "Collection",
      { operationId: "list-user-collections", userId: "u1" },
    ],
    newItem: item("new"),
  });
}

describe("addItemToFirstPage", () => {
  it("puts the item at the start of the first page of an infinite list", () => {
    const queryClient = setup();

    add(queryClient);

    const data = queryClient.getQueryData<{ pages: { items: Item[] }[] }>(
      infiniteKey,
    );

    expect(data?.pages[0]?.items.map((entry) => entry.id)).toEqual([
      "new",
      "1",
    ]);
  });

  it("puts the item at the start of a list that is not infinite (the preview of the profile) and keeps its limit", () => {
    const queryClient = setup();

    add(queryClient);

    const data = queryClient.getQueryData<{ items: Item[] }>(previewKey);

    expect(data?.items.map((entry) => entry.id)).toEqual([
      "new",
      "1",
      "2",
      "3",
    ]);
  });

  it("does not fail when both kinds of list are cached, and leaves the lists of other users alone", () => {
    const queryClient = setup();

    expect(() => add(queryClient)).not.toThrow();

    const other = queryClient.getQueryData<{ pages: { items: Item[] }[] }>(
      otherUserKey,
    );

    expect(other?.pages[0]?.items.map((entry) => entry.id)).toEqual(["9"]);
  });
});
