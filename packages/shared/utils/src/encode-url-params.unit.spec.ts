import { describe, expect, it } from "bun:test";

import { encodeUrlParams } from "./encode-url-params";

describe("util: encodeUrlParams", () => {
  it("should wrap a path param of a generated url", () => {
    const input =
      'const res = { method: "GET", url: `/profiles/${username}` as const };';

    expect(encodeUrlParams(input)).toBe(
      'const res = { method: "GET", url: `/profiles/${encodeURIComponent(String(username))}` as const };',
    );
  });

  it("should wrap every param of the url", () => {
    const input =
      'const res = { method: "DELETE", url: `/chats/${chatId}/participants/${userId}` as const };';

    expect(encodeUrlParams(input)).toBe(
      'const res = { method: "DELETE", url: `/chats/${encodeURIComponent(String(chatId))}/participants/${encodeURIComponent(String(userId))}` as const };',
    );
  });

  it("should not wrap a param twice", () => {
    const input =
      'const res = { method: "GET", url: `/profiles/${encodeURIComponent(String(username))}` as const };';

    expect(encodeUrlParams(input)).toBe(input);
    expect(encodeUrlParams(encodeUrlParams("url: `/a/${id}`"))).toBe(
      "url: `/a/${encodeURIComponent(String(id))}`",
    );
  });

  it("should leave urls without params alone", () => {
    const input = 'const res = { method: "GET", url: `/posts` as const };';

    expect(encodeUrlParams(input)).toBe(input);
  });

  it("should leave template strings that are not urls alone", () => {
    const input =
      "const key = `posts/${postId}`;\nconst message = `Hello ${name}`;";

    expect(encodeUrlParams(input)).toBe(input);
  });

  it("should only touch the urls of a multi-line file", () => {
    const input = [
      "export function getUrl({ postId }) {",
      '  const res = { method: "GET", url: `/posts/${postId}/likes` as const };',
      "  const label = `post ${postId}`;",
      "  return res;",
      "}",
    ].join("\n");

    expect(encodeUrlParams(input)).toBe(
      [
        "export function getUrl({ postId }) {",
        '  const res = { method: "GET", url: `/posts/${encodeURIComponent(String(postId))}/likes` as const };',
        "  const label = `post ${postId}`;",
        "  return res;",
        "}",
      ].join("\n"),
    );
  });
});
