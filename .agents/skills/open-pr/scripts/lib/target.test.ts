import { describe, expect, it } from "bun:test";

import { checkBase, isTrunk, pickTarget } from "./target";

const all = ["dev", "staging", "main"];
const noStaging = ["dev", "main"];

describe("pickTarget", () => {
  it("sends any branch of work to dev", () => {
    expect(
      pickTarget({ branch: "fix(web)/collections-cache", remoteTrunks: all })
        .base,
    ).toBe("dev");
    expect(
      pickTarget({ branch: "chore(repo)/x", remoteTrunks: noStaging }).base,
    ).toBe("dev");
  });

  it("promotes dev to staging, or to main when there is no staging, and staging to main", () => {
    expect(pickTarget({ branch: "dev", remoteTrunks: all }).base).toBe(
      "staging",
    );
    expect(pickTarget({ branch: "dev", remoteTrunks: noStaging }).base).toBe(
      "main",
    );
    expect(pickTarget({ branch: "staging", remoteTrunks: all }).base).toBe(
      "main",
    );
  });

  it("has nowhere to send main, and does not guess for another trunk", () => {
    expect(pickTarget({ branch: "main", remoteTrunks: all }).base).toBeNull();
    expect(pickTarget({ branch: "master", remoteTrunks: all }).base).toBeNull();
  });

  it("says so when the trunk it needs is not on the remote", () => {
    expect(
      pickTarget({ branch: "fix(web)/x", remoteTrunks: ["main"] }).base,
    ).toBeNull();
    expect(
      pickTarget({ branch: "staging", remoteTrunks: ["dev"] }).base,
    ).toBeNull();
  });
});

describe("checkBase", () => {
  it("accepts the base the flow gives", () => {
    expect(
      checkBase({ branch: "fix(web)/x", base: "dev", remoteTrunks: all }),
    ).toEqual([]);
  });

  it("refuses a branch of work that goes straight to staging or main", () => {
    expect(
      checkBase({ branch: "fix(web)/x", base: "main", remoteTrunks: all }).join(
        "\n",
      ),
    ).toContain("goes to");
    expect(
      checkBase({ branch: "feat(web)/x", base: "staging", remoteTrunks: all }),
    ).not.toEqual([]);
  });

  it("lets a hotfix skip the flow, and refuses a base that is not on the remote", () => {
    expect(
      checkBase({
        branch: "hotfix(backend)/x",
        base: "main",
        remoteTrunks: all,
      }),
    ).toEqual([]);
    expect(
      checkBase({
        branch: "hotfix(backend)/x",
        base: "prod",
        remoteTrunks: all,
      }).join("\n"),
    ).toContain("does not exist");
  });
});

describe("isTrunk", () => {
  it("knows dev, staging and main", () => {
    expect(isTrunk("dev")).toBe(true);
    expect(isTrunk("fix(web)/x")).toBe(false);
  });
});
