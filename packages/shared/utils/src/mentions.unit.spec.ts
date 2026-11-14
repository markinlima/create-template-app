import { describe, expect, it } from "bun:test";

import {
  countMentions,
  extractMentionIds,
  parseMentions,
  removeMentions,
} from "./mentions";

describe("util: mentions", () => {
  describe("extractMentionIds", () => {
    it("should extract mention ids from a string", () => {
      const v4 = "b0c266cb-e295-40ba-bc7c-599ec5abb93d";
      const v7 = "019ea2d6-5ffc-74d2-bd94-65c00b329a7d";

      const input = `Hello, <@${v4}> and <@${v7}>!`;

      const result = extractMentionIds(input);

      expect(result).toEqual([v4, v7]);
    });
  });

  describe("parseMentions", () => {
    it("should parse mentions and non-mention parts from a string", () => {
      const v4 = "b0c266cb-e295-40ba-bc7c-599ec5abb93d";
      const v7 = "019ea2d6-5ffc-74d2-bd94-65c00b329a7d";

      const input = `Hello, <@${v4}> and <@${v7}>!`;

      const result = parseMentions(input);

      expect(result).toEqual([
        { isMention: false, content: "Hello, " },
        { isMention: true, content: v4 },
        { isMention: false, content: " and " },
        { isMention: true, content: v7 },
        { isMention: false, content: "!" },
      ]);
    });
  });

  describe("removeMentions", () => {
    it("should leave only the typed text", () => {
      const v4 = "b0c266cb-e295-40ba-bc7c-599ec5abb93d";

      expect(removeMentions(`Hello, <@${v4}>!`)).toBe("Hello, !");
      expect(removeMentions("no mentions")).toBe("no mentions");
    });
  });

  describe("countMentions", () => {
    it("should count every mention, repeated ones included", () => {
      const v4 = "b0c266cb-e295-40ba-bc7c-599ec5abb93d";
      const v7 = "019ea2d6-5ffc-74d2-bd94-65c00b329a7d";

      expect(countMentions(`<@${v4}> <@${v7}> <@${v4}>`)).toBe(3);
      expect(countMentions("no mentions")).toBe(0);
    });
  });
});
