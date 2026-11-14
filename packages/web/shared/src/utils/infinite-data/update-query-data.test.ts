import { describe, expect, it } from "bun:test";

import { QueryClient } from "@tanstack/react-query";

import { updateQueryData } from "./update-query-data";

interface PostDto {
  post: { id: string; likeCount: number };
  context: { isLiked: boolean };
}

const makePost = (id: string): PostDto => ({
  post: { id, likeCount: 0 },
  context: { isLiked: false },
});

const feedKey = [
  "Post",
  { operationId: "feed", paginationType: "cursor", dataShape: "dto" },
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
  queryClient.setQueryData(feedKey, {
    pages: [{ items: [makePost("1"), makePost("2")], meta: {} }],
    pageParams: [undefined],
  });
  queryClient.setQueryData(listKey, { items: [makePost("1")] });
  queryClient.setQueryData(singleKey, makePost("1"));
  return queryClient;
}

function like(queryClient: QueryClient, postId: string) {
  return updateQueryData<PostDto>({
    queryClient,
    queryKey: ["Post"],
    where: ({ post }) => post.id === postId,
    set: (draft) => {
      draft.post.likeCount++;
    },
  });
}

describe("updateQueryData", () => {
  it("should update the item in feeds, lists and single caches sharing the same key without throwing", () => {
    const queryClient = setup();

    expect(() => like(queryClient, "1")).not.toThrow();

    const feed = queryClient.getQueryData<{ pages: { items: PostDto[] }[] }>(
      feedKey,
    );
    expect(feed?.pages[0]?.items[0]?.post.likeCount).toBe(1);
    expect(feed?.pages[0]?.items[1]?.post.likeCount).toBe(0);
    expect(
      queryClient.getQueryData<{ items: PostDto[] }>(listKey)?.items[0]?.post
        .likeCount,
    ).toBe(1);
    expect(queryClient.getQueryData<PostDto>(singleKey)?.post.likeCount).toBe(
      1,
    );
  });

  it("should not change anything when no item matches", () => {
    const queryClient = setup();

    like(queryClient, "unknown");

    expect(queryClient.getQueryData<PostDto>(singleKey)?.post.likeCount).toBe(
      0,
    );
  });
});
