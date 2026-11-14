import { describe, expect, it } from "bun:test";

import { parseRemote } from "./github";

describe("parseRemote", () => {
  it("reads owner and repository from the usual forms of a remote", () => {
    for (const url of [
      "https://github.com/acme/app.git",
      "https://github.com/acme/app",
      "git@github.com:acme/app.git",
      "ssh://git@github.com/acme/app.git",
      "https://user:token@github.com/acme/app.git\n",
    ]) {
      expect(parseRemote(url)).toEqual({
        owner: "acme",
        repo: "app",
      });
    }
  });

  it("keeps a dot inside the name of the repository", () => {
    expect(parseRemote("git@github.com:me/site.v2.git")).toEqual({
      owner: "me",
      repo: "site.v2",
    });
  });

  it("gives nothing for a remote that is not on GitHub", () => {
    expect(parseRemote("https://gitlab.com/me/site.git")).toBeNull();
    expect(parseRemote("")).toBeNull();
  });
});
